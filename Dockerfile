# 1단계: 빌드 환경 (Build Stage)
FROM node:20-alpine AS build

# 작업 디렉토리 설정
WORKDIR /app

# 종속성 파일 복사 및 설치
COPY package*.json ./
RUN npm install

# 소스 코드 복사 및 프로덕션 빌드 실행
COPY . .
# Vite build 명령 실행
RUN npm run build

# 2단계: 경량화된 실행 환경 (Production Stage)
FROM nginx:alpine AS final

# Nginx의 기본 설정 파일을 제거
RUN rm /etc/nginx/conf.d/default.conf

# 빌드 결과물(dist 폴더)을 Nginx의 기본 서비스 경로에 복사
COPY --from=build /app/dist /usr/share/nginx/html