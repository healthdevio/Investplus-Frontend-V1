import { Inject, Injectable } from '@angular/core';
import { CognitoCallback, CognitoUtil } from './cognito.service';
import { AuthenticationDetails, CognitoUser, CognitoUserAttribute } from 'amazon-cognito-identity-js';
// import { RegistrationUser } from '../public/auth/register/registration.component';
// import { NewPasswordUser } from "../public/auth/newpassword/newpassword.component";
import * as AWS from 'aws-sdk/global';

@Injectable()
export class UserRegistrationService {

    constructor(
        @Inject(CognitoUtil) public cognitoUtil: CognitoUtil
    ) { }

    register(user: any, callback: CognitoCallback): void {

        const attributeList = [];

        const dataEmail = {
            Name: 'email',
            Value: user.email
        };
        const dataNickname = {
            Name: 'nickname',
            Value: user.name
        };
        attributeList.push(new CognitoUserAttribute(dataEmail));
        attributeList.push(new CognitoUserAttribute(dataNickname));
        attributeList.push(new CognitoUserAttribute({
            Name: 'phone_number',
            Value: user.phone_number
        }));

        this.cognitoUtil.getUserPool().signUp(user.email, user.password, attributeList, null, function (err, result) {
            if (err) {
                callback.cognitoCallback(err.message, null);
            } else {
                callback.cognitoCallback(null, result);
            }
        });

    }

    confirmRegistration(username: string, confirmationCode: string, callback: CognitoCallback): void {

        const userData = {
            Username: username,
            Pool: this.cognitoUtil.getUserPool()
        };

        const cognitoUser = new CognitoUser(userData);

        cognitoUser.confirmRegistration(confirmationCode, true, function (err, result) {
            if (err) {
                callback.cognitoCallback(err.message, null);
            } else {
                callback.cognitoCallback(null, result);
            }
        });
    }

    resendCode(username: string, callback: CognitoCallback): void {
        const userData = {
            Username: username,
            Pool: this.cognitoUtil.getUserPool()
        };

        const cognitoUser = new CognitoUser(userData);

        cognitoUser.resendConfirmationCode(function (err, result) {
            if (err) {
                callback.cognitoCallback(err.message, null);
            } else {
                callback.cognitoCallback(null, result);
            }
        });
    }

    newPassword(newPasswordUser: any, callback: CognitoCallback): void {
        // Get these details and call
        // cognitoUser.completeNewPasswordChallenge(newPassword, userAttributes, this);
        const authenticationData = {
            Username: newPasswordUser.username,
            Password: newPasswordUser.existingPassword,
        };
        const authenticationDetails = new AuthenticationDetails(authenticationData);

        const userData = {
            Username: newPasswordUser.username,
            Pool: this.cognitoUtil.getUserPool()
        };

        const cognitoUser = new CognitoUser(userData);
        cognitoUser.authenticateUser(authenticationDetails, {
            newPasswordRequired: function (userAttributes, requiredAttributes) {
                // User was signed up by an admin and must provide new
                // password and required attributes, if any, to complete
                // authentication.

                // the api doesn't accept this field back
                delete userAttributes.email_verified;
                cognitoUser.completeNewPasswordChallenge(newPasswordUser.password, requiredAttributes, {
                    onSuccess: function (result) {
                        callback.cognitoCallback(null, userAttributes);
                    },
                    onFailure: function (err) {
                        callback.cognitoCallback(err, requiredAttributes);
                    }
                });
            },
            onSuccess: function (result) {
                callback.cognitoCallback(null, result);
            },
            onFailure: function (err) {
                callback.cognitoCallback(err, null);
            }
        });
    }
}
