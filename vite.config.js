import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import axios from 'axios'
import path from 'node:path'

const loginProxyPlugin = (apiTargetUrl) => ({
  name: 'login-proxy',
  configureServer(server) {
    server.middlewares.use('/api/ManageAccount/login', async (req, res) => {
      if (req.method !== 'POST') {
        res.statusCode = 405;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ status: false, message: 'Method not allowed.' }));
        return;
      }

      let body = '';

      req.on('data', (chunk) => {
        body += chunk;
      });

      req.on('end', async () => {
        try {
          const requestBody = body ? JSON.parse(body) : {};

          const apiResponse = await axios.post(
            `${apiTargetUrl}/ManageAccount/login`,
            {
              userName: requestBody.userName,
              password: requestBody.password,
            },
            {
              headers: {
                accept: '*/*',
                'Content-Type': 'application/json',
              },
            },
          );

          res.statusCode = apiResponse.status;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(apiResponse.data));
        } catch (error) {
          res.statusCode = error.response?.status || 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(
            JSON.stringify(
              error.response?.data || {
                status: false,
                message: error.message || 'Login proxy request failed.',
              },
            ),
          );
        }
      });
    });

    server.middlewares.use('/api/ManageAccount/forgot-password', async (req, res) => {
      if (req.method !== 'POST') {
        res.statusCode = 405;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ status: false, message: 'Method not allowed.' }));
        return;
      }

      let body = '';

      req.on('data', (chunk) => {
        body += chunk;
      });

      req.on('end', async () => {
        try {
          const requestBody = body ? JSON.parse(body) : {};

          const apiResponse = await axios.post(
            `${apiTargetUrl}/ManageAccount/forgot-password`,
            {
              userName: requestBody.userName,
            },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            },
          );

          res.statusCode = apiResponse.status;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(apiResponse.data));
        } catch (error) {
          res.statusCode = error.response?.status || 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(
            JSON.stringify(
              error.response?.data || {
                status: false,
                message: error.message || 'Forgot password proxy request failed.',
              },
            ),
          );
        }
      });
    });

    server.middlewares.use('/api/ManageBankDashboard/process/dashboard', async (req, res) => {
      if (req.method !== 'GET') {
        res.statusCode = 405;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ status: false, message: 'Method not allowed.' }));
        return;
      }

      try {
        const requestUrl = new URL(req.url, 'http://localhost');
        const payload = {
          userType: requestUrl.searchParams.get('userType') || 'admin',
          userName: requestUrl.searchParams.get('userName') || '',
        };

        const apiResponse = await axios.get(
          `${apiTargetUrl}/ManageBankDashboard/process/dashboard`,
          {
            data: payload,
            headers: {
              accept: '*/*',
              'Content-Type': 'application/json',
              ...(req.headers.authorization
                ? { Authorization: req.headers.authorization }
                : {}),
            },
          },
        );

        res.statusCode = apiResponse.status;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(apiResponse.data));
      } catch (error) {
        res.statusCode = error.response?.status || 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(
          JSON.stringify(
            error.response?.data || {
              status: false,
              message: error.message || 'Dashboard proxy request failed.',
            },
          ),
        );
      }
    });
  },
})

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiTargetUrl =
    env.VITE_API_TARGET_URL || 'https://demo.learnerssacademy.com/api';

  return {
    build: {
      rollupOptions: {
        input: path.posix.normalize('index.html'),
      },
    },
    plugins: [loginProxyPlugin(apiTargetUrl), react()],
  };
})
