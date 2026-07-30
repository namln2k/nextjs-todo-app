import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  InitiateAuthCommandInput,
} from '@aws-sdk/client-cognito-identity-provider';
import { parseJwt } from '@/services/auth';

export default function useAuth() {
  const cognitoClient = new CognitoIdentityProviderClient({
    region: process.env.NEXT_PUBLIC_AWS_REGION,
  });

  // const idToken = parseJwt(sessionStorage.idToken.toString());
  // const accessToken = parseJwt(sessionStorage.accessToken.toString());
  // console.log(
  //   `Amazon Cognito ID token encoded: ${sessionStorage.idToken.toString()}`,
  // );
  // console.log('Amazon Cognito ID token decoded: ');
  // console.log(idToken);
  // console.log(
  //   `Amazon Cognito access token encoded: ${sessionStorage.accessToken.toString()}`,
  // );
  // console.log('Amazon Cognito access token decoded: ');
  // console.log(accessToken);
  // console.log('Amazon Cognito refresh token: ');
  // console.log(sessionStorage.refreshToken);
  // console.log(
  //   'Amazon Cognito example application. Not for use in production applications.',
  // );

  const login = async (username: string, password: string) => {
    const params: InitiateAuthCommandInput = {
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || '',
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
      },
    };
    try {
      const command = new InitiateAuthCommand(params);
      const { AuthenticationResult } = await cognitoClient.send(command);
      if (AuthenticationResult) {
        sessionStorage.setItem('idToken', AuthenticationResult.IdToken || '');
        sessionStorage.setItem(
          'accessToken',
          AuthenticationResult.AccessToken || '',
        );
        sessionStorage.setItem(
          'refreshToken',
          AuthenticationResult.RefreshToken || '',
        );
        return AuthenticationResult;
      }
    } catch (error) {
      console.error('Error loging in: ', error);
      throw error;
    }
  };

  return {
    login,
  };
}
