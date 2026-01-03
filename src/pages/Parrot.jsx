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
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import PersonIcon from '@mui/icons-material/Person';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const Parrot = () => {
    const [role, setRole] = useState('GENERAL');
    const [users, setUsers] = useState([]);
    const [mode, setMode] = useState('COUNT'); // 'COUNT' or 'DURATION'
    const [count, setCount] = useState('1');
    const [duration, setDuration] = useState('1'); // minutes
    const [status, setStatus] = useState({ playing: false, message: '대기 중' });
    const [remaining, setRemaining] = useState(null);

    const socketRef = useRef(null);
    const audioRef = useRef(null);
    const roleRef = useRef(role);
    const timerRef = useRef(null);

    // 정규식 정의
    const COUNT_REGEX = /^[1-9][0-9]?$|^100$/; // 1 ~ 100
    const DURATION_REGEX = /^[1-9][0-9]{0,1}$|^[1-2][0-9]{2}$|^3[0-5][0-9]$|^360$/; // 1 ~ 360

    useEffect(() => {
        roleRef.current = role;
    }, [role]);

    useEffect(() => {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const host = window.location.hostname;
        const socketUrl = `${protocol}//${host}:8080/parrot-socket`;

        socketRef.current = new WebSocket(socketUrl);
        socketRef.current.onopen = () => socketRef.current.send(JSON.stringify({ type: 'JOIN', role: role }));
        socketRef.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'USER_LIST') setUsers(data.users);
            if (data.type === 'TRIGGER_SOUND' && roleRef.current === 'PARROT') startPlayback(data);
            if (data.type === 'STOP_SOUND' && roleRef.current === 'PARROT') stopPlayback();
        };

        return () => {
            if (socketRef.current) socketRef.current.close();
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
                    audioRef.current.play();
                    current++;
                    setRemaining(`${data.count - current}회 남음`);
                    audioRef.current.onended = play;
                } else {
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
                    stopPlayback();
                }
            };
            play();

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
                        {users.map((user) => (
                            <ListItem key={user.id} sx={{ px: 0 }}>
                                <ListItemText
                                    primary={user.id.substring(0, 8)}
                                    primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
                                    secondaryTypographyProps={{ component: 'div' }}
                                    secondary={<Chip label={user.role === 'PARROT' ? '앵무새' : '사용자'} size="small" variant="outlined" sx={{ mt: 0.5, height: 20, fontSize: '0.65rem' }} />}
                                />
                            </ListItem>
                        ))}
                    </List>

                    <Typography variant="caption" color="primary" sx={{ display: 'block', textAlign: 'center', fontWeight: 600, border: '1px dashed', borderColor: 'primary.main', p: 2, borderRadius: 2 }}>
                        팁: 기기 두 대로 각각 접속하여 실시간 소리 전송 실험을 해보세요!
                    </Typography>
                </Paper>
            </Box>
        </Container>
    );
};

export default Parrot;
