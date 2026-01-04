// src/pages/Vote.jsx

import React, { useState, useEffect, useRef } from 'react';
import {
    Container,
    Typography,
    Box,
    Button,
    TextField,
    Paper,
    Avatar,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    IconButton,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Fade,
    LinearProgress,
    Chip,
    Alert,
    Snackbar,
    Divider
} from '@mui/material';
import {
    Add as AddIcon,
    QrCode as QrCodeIcon,
    Timer as TimerIcon,
    People as PeopleIcon,
    ContentCopy as CopyIcon,
    NavigateNext as SkipIcon,
    ExitToApp as LeaveIcon,
    Check as CheckIcon,
    Close as CloseIcon,
    Refresh as RefreshIcon
} from '@mui/icons-material';
import { QRCodeSVG } from 'qrcode.react';

function Vote() {
    const [mode, setMode] = useState('LANDING'); // LANDING, ROOM
    const [roomCode, setRoomCode] = useState('');
    const [roomCount, setRoomCount] = useState(0);
    const [error, setError] = useState('');
    const [roomInfo, setRoomInfo] = useState(null);
    const [voting, setVoting] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [voteValue, setVoteValue] = useState(null);
    const [results, setResults] = useState(null);
    const [showQr, setShowQr] = useState(false);
    const [currentVotes, setCurrentVotes] = useState(0);
    const [myUserId, setMyUserId] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
    const [showRefreshPopup, setShowRefreshPopup] = useState(false);

    const socketRef = useRef(null);
    const heartbeatRef = useRef(null);
    const isConnectedRef = useRef(false);
    const countdownTimer = useRef(null);

    useEffect(() => {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const host = window.location.host;
        const socketUrl = `${protocol}//${host}/vote-socket`;

        const ws = new WebSocket(socketUrl);
        socketRef.current = ws;

        ws.onopen = () => {
            console.log('Connected to Vote Socket');
            isConnectedRef.current = true;
            ws.send(JSON.stringify({ type: 'GET_ROOM_COUNT' }));

            const params = new URLSearchParams(window.location.search);
            const code = params.get('code');
            if (code) {
                ws.send(JSON.stringify({ type: 'JOIN_ROOM', roomCode: code }));
            }

            heartbeatRef.current = setInterval(() => {
                if (ws.readyState === WebSocket.OPEN) {
                    ws.send(JSON.stringify({ type: 'PING' }));
                }
            }, 20000);
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'PONG') return;
            handleSocketMessage(data);
        };

        ws.onclose = () => {
            console.log('WebSocket closed');
            if (heartbeatRef.current) {
                clearInterval(heartbeatRef.current);
                heartbeatRef.current = null;
            }
            if (isConnectedRef.current) {
                setShowRefreshPopup(true);
                isConnectedRef.current = false;
            }
        };

        ws.onerror = (err) => {
            console.error('WebSocket error:', err);
        };

        const handleOffline = () => {
            console.log('Browser went offline');
            if (mode === 'ROOM') {
                setSnackbar({ open: true, message: '네트워크 연결이 끊겨 방에서 나갑니다. 🔌', severity: 'warning' });
                resetRoomState();
            }
            if (isConnectedRef.current) {
                setShowRefreshPopup(true);
                isConnectedRef.current = false;
            }
        };

        window.addEventListener('offline', handleOffline);

        // 주기적 오프라인 상태 체크 (브라우저 이벤트가 놓칠 수 있는 상황 대비)
        const onlineCheckInterval = setInterval(() => {
            if (!navigator.onLine && isConnectedRef.current) {
                console.log('Periodic check: Offline detected');
                handleOffline();
            }
        }, 3000);

        return () => {
            clearInterval(onlineCheckInterval);
            if (heartbeatRef.current) {
                clearInterval(heartbeatRef.current);
                heartbeatRef.current = null;
            }
            ws.onopen = null;
            ws.onmessage = null;
            ws.onerror = null;
            ws.onclose = null;
            window.removeEventListener('offline', handleOffline);

            if (ws.readyState === WebSocket.OPEN) {
                ws.close();
            }
            socketRef.current = null;
        };
    }, []);

    // 알림 처리 로직 (입장/퇴장/차례 변경)
    const prevUsersRef = useRef([]);
    useEffect(() => {
        if (!roomInfo || !myUserId) return;

        const prevUsers = prevUsersRef.current;
        const currentUsers = roomInfo.users;

        // 새로운 참여자 입장/퇴장 알림
        if (prevUsers.length > 0) {
            if (currentUsers.length > prevUsers.length) {
                setSnackbar({ open: true, message: '새로운 참여자가 입장했습니다. 👋', severity: 'info' });
            } else if (currentUsers.length < prevUsers.length) {
                setSnackbar({ open: true, message: '참여자가 나갔습니다. 🏃‍♂️', severity: 'info' });
            }
        }

        // 내 차례 알림 감지
        const wasMyTurn = prevUsers.find(u => u.id === myUserId)?.isCurrentTurn;
        const isMyTurn = currentUsers.find(u => u.id === myUserId)?.isCurrentTurn;

        if (isMyTurn && !wasMyTurn) {
            // Snackbar 알림
            setSnackbar({ open: true, message: '🔔 당신의 차례입니다! 투표를 시작해 주세요.', severity: 'success' });

            // 브라우저 알림 (API 지원 여부 확인 및 권한 체크)
            if (typeof Notification !== 'undefined') {
                if (Notification.permission === 'granted' && document.hidden) {
                    new Notification('JOY OPI SECRET VOTE', {
                        body: '당신의 차례입니다! 투표를 시작해 주세요.',
                        icon: '/favicon.ico'
                    });
                } else if (Notification.permission === 'default') {
                    // 참고: requestPermission은 보통 사용자 제스처(클릭 등) 내에서 호출해야 효과적입니다.
                    Notification.requestPermission().catch(err => console.error('Notification permission request failed:', err));
                }
            }
        }

        prevUsersRef.current = currentUsers;
    }, [roomInfo, myUserId]);

    const handleSocketMessage = (data) => {
        switch (data.type) {
            case 'ROOM_COUNT':
                setRoomCount(data.count);
                break;
            case 'ROOM_CREATED':
            case 'JOIN_SUCCESS':
                setMode('ROOM');
                setRoomCode(data.roomCode);
                setMyUserId(data.myUserId);
                window.history.pushState({}, '', `?code=${data.roomCode}`);
                break;
            case 'ROOM_INFO':
                setRoomInfo(data);
                break;
            case 'VOTE_STARTED':
                setVoting(true);
                setCountdown(data.duration);
                setVoteValue(null);
                setResults(null);
                setCurrentVotes(0);
                startCountdown(data.duration);
                break;
            case 'VOTE_SUBMITTED':
                setCurrentVotes(data.currentVotes);
                break;
            case 'VOTE_FINISHED':
                setVoting(false);
                setResults(data.results);
                setCountdown(0);
                if (countdownTimer.current) clearInterval(countdownTimer.current);
                break;
            case 'ERROR':
                setSnackbar({ open: true, message: data.message, severity: 'error' });
                break;
            default:
                break;
        }
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const startCountdown = (sec) => {
        if (countdownTimer.current) clearInterval(countdownTimer.current);
        let timeLeft = sec;
        countdownTimer.current = setInterval(() => {
            timeLeft -= 1;
            setCountdown(timeLeft);
            if (timeLeft <= 0) {
                clearInterval(countdownTimer.current);
                if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
                    socketRef.current.send(JSON.stringify({ type: 'FINISH_VOTE' }));
                }
            }
        }, 1000);
    };

    const handleCreateRoom = () => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({ type: 'CREATE_ROOM' }));
        }
    };

    const handleJoinRoom = () => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN && roomCode.length === 4) {
            socketRef.current.send(JSON.stringify({ type: 'JOIN_ROOM', roomCode }));
        }
    };

    const handleStartVote = () => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({ type: 'START_VOTE' }));
        }
    };

    const handleSubmitVote = (val) => {
        if (voteValue !== null) return;
        setVoteValue(val);
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({ type: 'SUBMIT_VOTE', value: val }));
        }
    };

    const handleSkipTurn = () => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            const isHost = roomInfo?.users?.find(u => u.id === myUserId)?.isHost;
            const isMyTurn = roomInfo?.users?.find(u => u.id === myUserId)?.isCurrentTurn;

            if (isHost && !isMyTurn) {
                setSnackbar({ open: true, message: '차례를 강제로 넘깁니다...', severity: 'warning' });
            }

            socketRef.current.send(JSON.stringify({ type: 'SKIP_TURN' }));
        }
    };

    const resetRoomState = () => {
        setVoting(false);
        setCountdown(0);
        setVoteValue(null);
        setCurrentVotes(0);
        setMyUserId(null);
        if (countdownTimer.current) {
            clearInterval(countdownTimer.current);
            countdownTimer.current = null;
        }

        setMode('LANDING');
        setRoomInfo(null);
        setResults(null);
        setRoomCode('');
        window.history.pushState({}, '', window.location.pathname);
    };

    const handleLeaveRoom = () => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({ type: 'LEAVE_ROOM' }));
        }
        resetRoomState();
    };

    const renderLanding = () => (
        <Fade in>
            <Box sx={{ mt: 10, textAlign: 'center' }}>
                <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, color: 'primary.main' }}>
                    SECRET VOTE
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 6 }}>
                    함께 있는 동료들과 실시간 익명 투표!<br />
                    현재 활성 방: <strong>{roomCount}</strong>개
                </Typography>

                <Paper sx={{ p: 4, borderRadius: 6, maxWidth: 400, mx: 'auto', border: '1px solid', borderColor: 'divider' }}>
                    <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        startIcon={<AddIcon />}
                        onClick={handleCreateRoom}
                        sx={{ mb: 4, py: 2, borderRadius: 3, fontWeight: 'bold' }}
                    >
                        방 새로 만들기
                    </Button>

                    <Divider sx={{ mb: 4 }}>또는</Divider>

                    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'stretch' }}>
                        <TextField
                            placeholder="방 번호 4자리"
                            value={roomCode}
                            onChange={(e) => setRoomCode(e.target.value.replace(/[^0-9]/g, ''))}
                            inputProps={{ maxLength: 4, style: { textAlign: 'center', fontWeight: 'bold' } }}
                            sx={{
                                flex: 8,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 3,
                                    bgcolor: 'rgba(0,0,0,0.02)'
                                }
                            }}
                        />
                        <Button
                            variant="contained"
                            onClick={handleJoinRoom}
                            disabled={roomCode.length !== 4}
                            sx={{
                                flex: 2,
                                borderRadius: 3,
                                fontWeight: 'bold',
                                minWidth: '70px',
                                boxShadow: 'none'
                            }}
                        >
                            입장
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Fade>
    );

    const renderRoom = () => {
        if (!roomInfo) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
        const myUser = roomInfo.users?.find(u => u.id === myUserId);
        const myTurn = myUser?.isCurrentTurn;
        const currentTurnUser = roomInfo.users?.find(u => u.isCurrentTurn);
        const isHost = myUser?.isHost;

        return (
            <Fade in>
                <Box sx={{ mt: 6 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Box>
                            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>방 번호: {roomCode}</Typography>
                            <Typography variant="body2" color="text.secondary">코드를 공유하여 초대하세요.</Typography>
                        </Box>
                        <Box>
                            <IconButton onClick={() => setShowQr(true)} color="primary"><QrCodeIcon /></IconButton>
                            <IconButton onClick={handleLeaveRoom} color="error"><LeaveIcon /></IconButton>
                        </Box>
                    </Box>

                    <Paper sx={{ p: 3, borderRadius: 4, mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <PeopleIcon sx={{ mr: 1, opacity: 0.6 }} />
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>참여자 ({roomInfo.users.length}명)</Typography>
                        </Box>
                        <List dense>
                            {roomInfo.users.map((user, idx) => (
                                <ListItem key={idx} sx={{
                                    borderRadius: 3,
                                    mb: 1,
                                    bgcolor: user.id === myUserId ? 'rgba(25, 118, 210, 0.08)' : (user.isCurrentTurn ? 'rgba(255, 152, 0, 0.05)' : 'transparent'),
                                    border: user.id === myUserId ? '2px solid' : (user.isCurrentTurn ? '1px dashed' : '1px solid'),
                                    borderColor: user.id === myUserId ? 'primary.main' : (user.isCurrentTurn ? 'warning.main' : 'divider'),
                                    transition: 'all 0.2s ease',
                                    '&:hover': { bgcolor: 'action.hover' }
                                }}>
                                    <ListItemAvatar>
                                        <Avatar sx={{ width: 32, height: 32, fontSize: '0.8rem', bgcolor: user.isCurrentTurn ? 'primary.main' : 'grey.400' }}>
                                            {idx + 1}
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Typography sx={{ fontWeight: user.id === myUserId ? 800 : 500, fontSize: '1rem' }}>
                                                    {user.nickname} {user.id === myUserId && <span style={{ color: '#1976d2', fontWeight: 600 }}>(나)</span>}
                                                </Typography>
                                                {user.isHost && <Chip label="방장" size="small" variant="filled" color="primary" sx={{ height: 18, fontSize: '0.6rem' }} />}
                                            </Box>
                                        }
                                        primaryTypographyProps={{ component: 'div' }}
                                        secondary={
                                            user.isCurrentTurn ? (
                                                <Box sx={{ display: 'flex', alignItems: 'center', color: 'warning.dark', mt: 0.5 }}>
                                                    <TimerIcon sx={{ fontSize: '0.9rem', mr: 0.5 }} />
                                                    <Typography variant="caption" sx={{ fontWeight: 'bold' }}>투표 시작 권한 보유</Typography>
                                                </Box>
                                            ) : null
                                        }
                                        secondaryTypographyProps={{ component: 'div' }}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Paper>

                    {voting ? (
                        <Paper elevation={4} sx={{ p: 4, borderRadius: 6, textAlign: 'center', border: '2px solid', borderColor: 'primary.main' }}>
                            <Typography variant="h6" gutterBottom>투표가 시작되었습니다!</Typography>
                            <Typography variant="h2" sx={{ fontWeight: 900, color: 'primary.main', mb: 2 }}>{countdown}s</Typography>
                            <LinearProgress variant="determinate" value={(countdown / 10) * 100} sx={{ height: 10, borderRadius: 5, mb: 3 }} />

                            <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', mt: 4 }}>
                                <Button
                                    variant={voteValue === 'YES' ? 'contained' : 'outlined'}
                                    color="primary"
                                    size="large"
                                    onClick={() => handleSubmitVote('YES')}
                                    sx={{ py: 2, px: 8, borderRadius: 3, fontSize: '1.2rem', fontWeight: 'bold' }}
                                >
                                    투표하기 (YES)
                                </Button>
                            </Box>
                            {voteValue && <Typography sx={{ mt: 3 }} color="success.main">투표 완료! 결과를 기다리는 중...</Typography>}
                        </Paper>
                    ) : (
                        <Box>
                            {results && (
                                <Paper sx={{ p: 4, borderRadius: 4, mb: 3, bgcolor: 'primary.50', border: '1px solid', borderColor: 'primary.light' }}>
                                    <Typography variant="h6" align="center" gutterBottom sx={{ fontWeight: 'bold' }}>투표 집계 결과</Typography>
                                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                                        <Typography variant="h2" color="primary.main" sx={{ fontWeight: 800 }}>
                                            {results.YES || 0} <small style={{ fontSize: '1.5rem', color: 'gray' }}>/ {results.totalParticipants || roomInfo.users.length}</small>
                                        </Typography>
                                        <Typography variant="body1" sx={{ mt: 1, color: 'text.secondary', fontWeight: 'medium' }}>
                                            전체 참여자 중 <strong>{results.YES || 0}</strong>명이 YES를 눌렀습니다.
                                        </Typography>
                                    </Box>
                                </Paper>
                            )}

                            {currentTurnUser?.isCurrentTurn ? (
                                <Box sx={{ display: 'flex', gap: 1.5 }}>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        size="large"
                                        startIcon={<TimerIcon />}
                                        onClick={handleStartVote}
                                        disabled={!myTurn}
                                        sx={{
                                            flex: 7,
                                            py: 2,
                                            borderRadius: 4,
                                            fontWeight: 800,
                                            textTransform: 'none',
                                            boxShadow: 3
                                        }}
                                    >
                                        투표 시작하기
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        size="large"
                                        onClick={handleSkipTurn}
                                        sx={{
                                            flex: 3,
                                            borderRadius: 4,
                                            fontWeight: 'bold',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 0,
                                            lineHeight: 1.2,
                                            py: 1,
                                            textTransform: 'none',
                                            color: !myTurn && isHost ? 'error.main' : 'primary.main',
                                            borderColor: !myTurn && isHost ? 'error.main' : 'primary.main'
                                        }}
                                    >
                                        <SkipIcon sx={{ fontSize: '1.2rem' }} />
                                        <Typography variant="caption" sx={{ fontWeight: 800, fontSize: '0.7rem' }}>
                                            {!myTurn && isHost ? '강제 넘기기' : '차례 넘기기'}
                                        </Typography>
                                    </Button>
                                </Box>
                            ) : (
                                <Paper sx={{ p: 4, borderRadius: 4, textAlign: 'center', bgcolor: 'grey.50', border: '1px dashed', borderColor: 'divider' }}>
                                    <Typography color="text.secondary">
                                        현재는 <strong>{currentTurnUser?.nickname}</strong> 님의 차례입니다.<br />
                                        본인 차례가 되면 '투표 시작' 버튼이 활성화됩니다.
                                    </Typography>
                                </Paper>
                            )}
                        </Box>
                    )}

                    <Dialog open={showQr} onClose={() => setShowQr(false)} PaperProps={{ sx: { borderRadius: 4 } }}>
                        <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold' }}>초대 QR 코드</DialogTitle>
                        <DialogContent sx={{ textAlign: 'center', pb: 4 }}>
                            <Box sx={{ p: 2, bgcolor: 'white', display: 'inline-block', borderRadius: 2, border: '1px solid', borderColor: 'divider', mb: 3 }}>
                                <QRCodeSVG value={window.location.href} size={200} />
                            </Box>
                            <Button
                                startIcon={<CopyIcon />}
                                fullWidth
                                variant="outlined"
                                onClick={() => {
                                    if (navigator.clipboard && navigator.clipboard.writeText) {
                                        navigator.clipboard.writeText(window.location.href).then(() => {
                                            setSnackbar({ open: true, message: '링크가 복사되었습니다!', severity: 'success' });
                                        }).catch(err => {
                                            console.error('Clipboard copy failed:', err);
                                            setSnackbar({ open: true, message: '복사에 실패했습니다. 직접 복사해 주세요.', severity: 'error' });
                                        });
                                    } else {
                                        setSnackbar({ open: true, message: '브라우저가 복사 기능을 지원하지 않습니다.', severity: 'warning' });
                                    }
                                }}
                                sx={{ borderRadius: 2 }}
                            >
                                초대 링크 복사
                            </Button>
                        </DialogContent>
                    </Dialog>
                </Box>
            </Fade >
        );
    };

    return (
        <Container maxWidth="sm">
            <Snackbar
                open={snackbar.open}
                autoHideDuration={2500}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbar.severity} variant="filled" sx={{ width: '100%', borderRadius: 2 }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>

            {error && (
                <Snackbar
                    open={!!error}
                    autoHideDuration={4000}
                    onClose={() => setError('')}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <Alert severity="error" variant="filled" sx={{ width: '100%', borderRadius: 2 }} onClose={() => setError('')}>
                        {error}
                    </Alert>
                </Snackbar>
            )}

            {mode === 'LANDING' ? renderLanding() : renderRoom()}

            {/* 연결 종료 시 새로고침 안내 팝업 */}
            <Dialog
                open={showRefreshPopup}
                disableEscapeKeyDown
                onClose={(event, reason) => {
                    if (reason !== 'backdropClick') setShowRefreshPopup(false);
                }}
                PaperProps={{
                    sx: { borderRadius: 3, p: 1 }
                }}
            >
                <DialogTitle sx={{ fontWeight: 700 }}>
                    연결이 종료되었습니다
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1" color="text.secondary">
                        서버와의 연결이 끊어졌습니다. 서비스를 계속 이용하시려면 페이지를 새로고침 해주세요.
                    </Typography>
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
}

export default Vote;
