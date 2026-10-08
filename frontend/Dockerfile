FROM node:25-slim

WORKDIR /app

ARG NEXT_PUBLIC_API_URL=http://localhost:5000
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_TELEMETRY_DISABLED=1

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

ENV NODE_ENV=production
RUN chown -R node:node /app/.next
USER node

EXPOSE 3000
CMD ["npm", "start"]
