import {Injectable} from '@angular/core';
import {CognitoCallback, CognitoUtil, LoggedInCallback} from './cognito.service';
import {AuthenticationDetails, CognitoUser, CognitoUserSession} from 'amazon-cognito-identity-js';
import * as AWS from 'aws-sdk/global';
import * as STS from 'aws-sdk/clients/sts';
import {environment} from '../../../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class UserLoginService {

    private onLoginSuccess = (callback: CognitoCallback, session: CognitoUserSession) => {
        AWS.config.credentials = this.cognitoUtil.buildCognitoCreds(session.getIdToken().getJwtToken());
        const clientParams: any = {};
        if (environment.sts_endpoint) {
            clientParams.endpoint = environment.sts_endpoint;
        }
        const sts = new STS(clientParams);
        sts.getCallerIdentity((err, data) => {
            callback.cognitoCallback(null, session);
        });
    }

    private onLoginError = (callback: CognitoCallback, err) => {
        callback.cognitoCallback(err.message, null);
    }


    constructor(
        public cognitoUtil: CognitoUtil,
        private http: HttpClient
    ) { }

    authenticate(username: string, password: string, callback: CognitoCallback) {
        const authenticationData = {
            Username: username,
            Password: password,
        };
        const authenticationDetails = new AuthenticationDetails(authenticationData);
        const userData = {
            Username: username,
            Pool: this.cognitoUtil.getUserPool()
        };
        const cognitoUser = new CognitoUser(userData);
        cognitoUser.authenticateUser(authenticationDetails, {
            newPasswordRequired: ((userAttributes, requiredAttributes) => {
                callback.cognitoCallback(`User needs to set password.`, userAttributes);
            }),
            onSuccess: result => this.onLoginSuccess(callback, result),
            onFailure: err => this.onLoginError(callback, err),
            mfaRequired: (challengeName, challengeParameters) => {
                callback.handleMFAStep(challengeName, challengeParameters, (confirmationCode: string) => {
                    cognitoUser.sendMFACode(confirmationCode, {
                        onSuccess: result => this.onLoginSuccess(callback, result),
                        onFailure: err => this.onLoginError(callback, err)
                    });
                });
            }
        });
    }

    forgotPassword(username: string, callback: CognitoCallback) {
        const userData = {
            Username: username,
            Pool: this.cognitoUtil.getUserPool()
        };
        const cognitoUser = new CognitoUser(userData);
        cognitoUser.forgotPassword({
            onSuccess: () => {
                console.log('Solicitação de recuperação de senha enviada com sucesso.');
            },
            onFailure: (err) => {
                callback.cognitoCallback(err.message || JSON.stringify(err), null);
            },
            inputVerificationCode: () => {
                callback.cognitoCallback(null, null);
            }
        });
    }

    confirmNewPassword(email: string, verificationCode: string, password: string, callback: CognitoCallback) {
        const userData = {
            Username: email,
            Pool: this.cognitoUtil.getUserPool()
        };
        const cognitoUser = new CognitoUser(userData);
        cognitoUser.confirmPassword(verificationCode, password, {
            onSuccess: () => {
                callback.cognitoCallback(null, null);
            },
            onFailure: (err) => {
                callback.cognitoCallback(err.message || JSON.stringify(err), null);
            }
        });
    }

    resendConfirmationCode(email: string, callback: CognitoCallback): void {
        const cognitoUser = new CognitoUser({
            Username: email,
            Pool: this.cognitoUtil.getUserPool()
        });
        cognitoUser.resendConfirmationCode((err, result) => {
            if (err) {
                callback.cognitoCallback(err.message || JSON.stringify(err), null);
            } else {
                if (callback.resendConfirmationCallback) {
                    callback.resendConfirmationCallback(null, result);
                } else {
                    console.error('O callback resendConfirmationCallback não foi implementado no componente.');
                    callback.cognitoCallback('Erro de implementação: resendConfirmationCallback ausente.', null);
                }
            }
        });
    }

    resendTemporaryPasswordEmail(email: string): Observable<any> {
        const apiUrl = 'https://f95fnir3hl.execute-api.us-east-2.amazonaws.com/v1/resend-welcome-email';

        const headers = new HttpHeaders({
            'x-api-key': 'oKxjVV7umQ5FCcbdT8CHJa8ztW1uxa1j54TftZGg'
        });

        return this.http.post(apiUrl, { email }, { headers: headers });
    }

    logout() {
        console.log('UserLoginService: Logging out');
        this.cognitoUtil.getCurrentUser().signOut();
    }

    isAuthenticated(callback: LoggedInCallback) {
        // console.log(callback);
        if (callback == null) {
            // tslint:disable-next-line:no-string-throw
            throw('UserLoginService: Callback in isAuthenticated() cannot be null');
        }

        const cognitoUser = this.cognitoUtil.getCurrentUser();

        if (cognitoUser != null) {

            cognitoUser.getSession(function (err, session) {
                if (err) {
                    // console.log('UserLoginService: Couldnt get the session: ' + err, err.stack);
                    callback.isLoggedIn(err, false);
                } else {
                    // console.log('UserLoginService: Session is ' + session.isValid());
                    callback.isLoggedIn(err, session.isValid());
                }
            });
        } else {
            // console.log('UserLoginService: cant retrieve the current user');
            callback.isLoggedIn('Cant retrieve the CurrentUser', false);
        }
    }
}
