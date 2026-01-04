import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Button,
    Container,
    Typography,
    Paper,
    Radio,
    RadioGroup,
    FormControlLabel,
    List,
    ListItem,
    ListItemText,
    Chip,
    TextField,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import PersonIcon from '@mui/icons-material/Person';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import RefreshIcon from '@mui/icons-material/Refresh';

const Parrot = () => {
    const [role, setRole] = useState('GENERAL');
    const [users, setUsers] = useState([]);
    const [mode, setMode] = useState('COUNT'); // 'COUNT' or 'DURATION'
    const [count, setCount] = useState('1');
    const [duration, setDuration] = useState('1'); // minutes
    const [status, setStatus] = useState({ playing: false, message: '대기 중' });
    const [remaining, setRemaining] = useState(null);
    const [myId, setMyId] = useState(null);
    const [showRefreshPopup, setShowRefreshPopup] = useState(false);

    const socketRef = useRef(null);
    const audioRef = useRef(null);
    const roleRef = useRef(role);
    const timerRef = useRef(null);
    const heartbeatRef = useRef(null);
    const isConnectedRef = useRef(false);

    // 정규식 정의
    const COUNT_REGEX = /^[1-9][0-9]?$|^100$/; // 1 ~ 100
    const DURATION_REGEX = /^[1-9][0-9]{0,1}$|^[1-2][0-9]{2}$|^3[0-5][0-9]$|^360$/; // 1 ~ 360

    useEffect(() => {
        roleRef.current = role;
    }, [role]);

    useEffect(() => {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const host = window.location.host;
        const socketUrl = `${protocol}//${host}/parrot-socket`;

        socketRef.current = new WebSocket(socketUrl);
        socketRef.current.onopen = () => {
            isConnectedRef.current = true;
            socketRef.current.send(JSON.stringify({ type: 'JOIN', role: role }));
            // Start heartbeat
            heartbeatRef.current = setInterval(() => {
                if (socketRef.current?.readyState === WebSocket.OPEN) {
                    socketRef.current.send(JSON.stringify({ type: 'PING' }));
                }
            }, 30000); // 30 seconds
        };

        socketRef.current.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
        socketRef.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'PONG') return; // Ignore pong
            if (data.type === 'WELCOME') setMyId(data.sessionId);
            if (data.type === 'USER_LIST') setUsers(data.users);
            if (data.type === 'TRIGGER_SOUND') {
                if (roleRef.current === 'PARROT') {
                    startPlayback(data);
                } else {
                    startMonitoring(data);
                }
            }
            if (data.type === 'STOP_SOUND') stopPlayback();
            if (data.type === 'PROGRESS_UPDATE') {
                if (roleRef.current !== 'PARROT') {
                    if (data.remainingCount !== undefined) {
                        setRemaining(`${data.remainingCount}회 남음`);
                    } else if (data.remainingDuration !== undefined) {
                        setRemaining(`${data.remainingDuration}분 남음`);
                    }
                    if (!status.playing) {
                        setStatus({ playing: true, message: '재생 중' });
                    }
                }
            }
        };

        socketRef.current.onclose = () => {
            console.log('WebSocket connection closed');
            if (heartbeatRef.current) {
                clearInterval(heartbeatRef.current);
                heartbeatRef.current = null;
            }
            if (isConnectedRef.current) {
                setShowRefreshPopup(true);
                isConnectedRef.current = false;
            }
        };

        const handleOffline = () => {
            console.log('Browser went offline');
            if (isConnectedRef.current) {
                setShowRefreshPopup(true);
                isConnectedRef.current = false;
            }
        };

        window.addEventListener('offline', handleOffline);

        return () => {
            if (heartbeatRef.current) clearInterval(heartbeatRef.current);
            if (socketRef.current) {
                socketRef.current.onclose = null; // Unmount 시 팝업 방지
                socketRef.current.onerror = null;
                if (socketRef.current.readyState === WebSocket.OPEN) {
                    socketRef.current.close();
                }
            }
            window.removeEventListener('offline', handleOffline);
            stopPlayback();
        };
    }, []);

    const handleRoleChange = (event) => {
        const newRole = event.target.value;
        setRole(newRole);
        if (socketRef.current?.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({ type: 'JOIN', role: newRole }));
        }
    };

    const startPlayback = (data) => {
        stopPlayback();
        audioRef.current.src = '/sound/footsteps.mp3';
        setStatus({ playing: true, message: '재생 중' });

        if (data.mode === 'COUNT') {
            let current = 0;
            const play = () => {
                if (current < data.count) {
                    current++;
                    const remainingCount = data.count - current;
                    setRemaining(`${remainingCount}회 남음`);

                    // 재생 시작 시점에 진행 상황 전송 (즉시 동기화)
                    if (socketRef.current?.readyState === WebSocket.OPEN) {
                        socketRef.current.send(JSON.stringify({
                            type: 'PROGRESS_UPDATE',
                            remainingCount: remainingCount
                        }));
                    }

                    audioRef.current.play();
                    audioRef.current.onended = play;
                } else {
                    // 모든 재생 완료 시 중지 신호 전송 -> 사용자 화면도 '대기 중'으로 전환
                    if (socketRef.current?.readyState === WebSocket.OPEN) {
                        socketRef.current.send(JSON.stringify({ type: 'STOP_SOUND' }));
                    }
                    stopPlayback();
                }
            };
            play();
        } else {
            const endTime = Date.now() + data.duration * 60 * 1000;
            const play = () => {
                if (Date.now() < endTime) {
                    audioRef.current.play();
                    audioRef.current.onended = play;
                } else {
                    if (socketRef.current?.readyState === WebSocket.OPEN) {
                        socketRef.current.send(JSON.stringify({ type: 'STOP_SOUND' }));
                    }
                    stopPlayback();
                }
            };
            play();

            let timeLeft = data.duration * 60;
            setRemaining(`${Math.ceil(timeLeft / 60)}분 남음`);
            timerRef.current = setInterval(() => {
                const prevMinutes = Math.ceil(timeLeft / 60);
                timeLeft--;
                const currentMinutes = Math.ceil(timeLeft / 60);

                if (timeLeft <= 0) {
                    if (socketRef.current?.readyState === WebSocket.OPEN) {
                        socketRef.current.send(JSON.stringify({ type: 'STOP_SOUND' }));
                    }
                    stopPlayback();
                } else {
                    setRemaining(`${currentMinutes}분 남음`);
                    // 분 단위가 바뀔 때만 서버에 업데이트 전송
                    if (prevMinutes !== currentMinutes && socketRef.current?.readyState === WebSocket.OPEN) {
                        socketRef.current.send(JSON.stringify({
                            type: 'PROGRESS_UPDATE',
                            remainingDuration: currentMinutes
                        }));
                    }
                }
            }, 1000);
        }
    };

    const startMonitoring = (data) => {
        stopPlayback();
        setStatus({ playing: true, message: '재생 중' });

        if (data.mode === 'COUNT') {
            let current = 0;
            current++;
            setRemaining(`${data.count - current}회 남음`);

            // COUNT 모드에서는 더 이상 추정치로 줄이지 않음 (서버의 PROGRESS_UPDATE 대기)
            // 타임아웃 방지를 위해 polling이나 단순 대기 처리 (여기서는 아무것도 안 함)
        } else {
            let timeLeft = data.duration * 60;
            setRemaining(`${Math.ceil(timeLeft / 60)}분 남음`);
            timerRef.current = setInterval(() => {
                timeLeft--;
                if (timeLeft <= 0) {
                    stopPlayback();
                } else {
                    setRemaining(`${Math.ceil(timeLeft / 60)}분 남음`);
                }
            }, 1000);
        }
    };

    const stopPlayback = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            audioRef.current.onended = null;
        }
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
        setStatus({ playing: false, message: '대기 중' });
        setRemaining(null);
    };

    const handleCall = () => {
        if (socketRef.current?.readyState === WebSocket.OPEN) {
            const finalCount = mode === 'COUNT' ? parseInt(count) : 0;
            const finalDuration = mode === 'DURATION' ? parseInt(duration) : 0;

            socketRef.current.send(JSON.stringify({
                type: 'TRIGGER_SOUND',
                mode,
                count: finalCount,
                duration: finalDuration,
                soundFile: 'footsteps.mp3'
            }));
        }
    };

    const handleStop = () => {
        if (socketRef.current?.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({ type: 'STOP_SOUND' }));
        }
        // 앵무새 역할인 경우 로컬에서도 즉시 중지 처리 (반응성 향상)
        if (role === 'PARROT') {
            stopPlayback();
        }
    };

    const isCountError = mode === 'COUNT' && !COUNT_REGEX.test(count);
    const isDurationError = mode === 'DURATION' && !DURATION_REGEX.test(duration);
    const isError = isCountError || isDurationError;

    return (
        <Container maxWidth="sm" sx={{ mt: 12, mb: 12 }}>
            <audio ref={audioRef} />

            <Box sx={{ mb: 6, textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 900, mb: 1 }}>앵무새 서비스</Typography>
                <Typography variant="body2" color="text.secondary">실시간 원격 소리 재생</Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {/* 1. 역할 설정 및 안내 */}
                <Paper sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <HelpOutlineIcon fontSize="small" color="primary" />
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>역할 선택</Typography>
                    </Box>
                    <RadioGroup row value={role} onChange={handleRoleChange} sx={{ mb: 3 }}>
                        <FormControlLabel value="GENERAL" control={<Radio />} label="사용자" />
                        <FormControlLabel value="PARROT" control={<Radio />} label="앵무새" />
                    </RadioGroup>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', bgcolor: 'background.default', p: 2, borderRadius: 2 }}>
                        • <b>사용자</b>: 다른 기기(앵무새)로 소리 재생을 요청합니다.<br />
                        • <b>앵무새</b>: 사용자의 요청을 수신하여 소리를 직접 재생합니다.
                    </Typography>
                </Paper>

                {/* 2. 재생 설정 */}
                <Paper sx={{ p: 4 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>재생 설정</Typography>
                    <RadioGroup row value={mode} onChange={(e) => setMode(e.target.value)} sx={{ mb: 3 }}>
                        <FormControlLabel value="COUNT" control={<Radio />} label="횟수(회)" />
                        <FormControlLabel value="DURATION" control={<Radio />} label="시간(분)" />
                    </RadioGroup>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            {mode === 'COUNT' ? (
                                <TextField
                                    label="횟수"
                                    size="small"
                                    value={count}
                                    onChange={(e) => setCount(e.target.value)}
                                    error={isCountError}
                                    helperText={isCountError ? "1~100 사이" : ""}
                                    sx={{ width: 110 }}
                                />
                            ) : (
                                <TextField
                                    label="분"
                                    size="small"
                                    value={duration}
                                    onChange={(e) => setDuration(e.target.value)}
                                    error={isDurationError}
                                    helperText={isDurationError ? "1~360 사이" : ""}
                                    sx={{ width: 110 }}
                                />
                            )}
                            <Box sx={{ display: 'flex', gap: 1.5, flex: 1 }}>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={handleCall}
                                    disabled={role === 'PARROT' || isError}
                                    startIcon={<PlayArrowIcon />}
                                    sx={{ py: 1, flex: 1, whiteSpace: 'nowrap' }}
                                >
                                    호출
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={handleStop}
                                    disabled={role === 'PARROT' ? !status.playing : false}
                                    startIcon={<StopIcon />}
                                    sx={{ py: 1, flex: 1, whiteSpace: 'nowrap' }}
                                >
                                    정지
                                </Button>
                            </Box>
                        </Box>
                    </Box>

                    <Divider sx={{ my: 2, opacity: 0.5 }} />

                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                        <Typography variant="overline" color="text.secondary">시스템 상태</Typography>
                        <Typography variant="h6" color={status.playing ? 'primary' : 'textSecondary'} sx={{ fontWeight: 700 }}>
                            {status.message}
                        </Typography>
                        {remaining && (
                            <Typography variant="h4" sx={{ fontWeight: 900, mt: 1, color: 'secondary.main' }}>
                                {remaining}
                            </Typography>
                        )}
                    </Box>
                </Paper>

                {/* 3. 접속자 및 가이즈 */}
                <Paper sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>접속자 ({users.length}명)</Typography>
                        <PersonIcon fontSize="small" color="disabled" />
                    </Box>
                    <List dense sx={{ mb: 3 }}>
                        {users.map((user) => {
                            const isMe = user.id === myId;
                            const isParrot = user.role === 'PARROT';
                            let bgcolor = 'transparent';
                            if (isMe) bgcolor = isParrot ? '#e8f5e9' : '#e3f2fd';

                            return (
                                <ListItem key={user.id} sx={{ px: 2, py: 1, mb: 1, borderRadius: 2, bgcolor: bgcolor, border: isMe ? 1 : 0, borderColor: isParrot ? 'success.main' : 'primary.main' }}>
                                    <ListItemText
                                        primary={
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Typography variant="body2" fontWeight={600}>
                                                    {user.id.substring(0, 8)}
                                                </Typography>
                                                {isMe && <Chip label="나" size="small" color={isParrot ? "success" : "primary"} sx={{ height: 20, fontSize: '0.65rem' }} />}
                                            </Box>
                                        }
                                        primaryTypographyProps={{ component: 'div' }}
                                        secondary={<Chip label={isParrot ? '앵무새' : '사용자'} size="small" variant="outlined" color={isParrot ? "success" : "default"} sx={{ mt: 0.5, height: 20, fontSize: '0.65rem' }} />}
                                        secondaryTypographyProps={{ component: 'div' }}
                                    />
                                </ListItem>
                            );
                        })}
                    </List>

                    <Typography variant="caption" color="primary" sx={{ display: 'block', textAlign: 'center', fontWeight: 600, border: '1px dashed', borderColor: 'primary.main', p: 2, borderRadius: 2 }}>
                        팁: 기기 두 대로 각각 접속하여 실시간 소리 전송 실험을 해보세요!
                    </Typography>
                </Paper>
            </Box>

            {/* 연결 종료 시 새로고침 안내 팝업 */}
            <Dialog
                open={showRefreshPopup}
                aria-labelledby="refresh-dialog-title"
                aria-describedby="refresh-dialog-description"
                PaperProps={{
                    sx: { borderRadius: 3, p: 1 }
                }}
            >
                <DialogTitle id="refresh-dialog-title" sx={{ fontWeight: 700 }}>
                    연결이 종료되었습니다
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="refresh-dialog-description">
                        서버와의 연결이 끊어졌습니다. 서비스를 계속 이용하시려면 페이지를 새로고침 해주세요.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ p: 2, pt: 0 }}>
                    <Button
                        onClick={() => window.location.reload()}
                        variant="contained"
                        fullWidth
                        startIcon={<RefreshIcon />}
                        sx={{ borderRadius: 2, py: 1.5, fontWeight: 700 }}
                    >
                        새로고침 하기
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Parrot;
