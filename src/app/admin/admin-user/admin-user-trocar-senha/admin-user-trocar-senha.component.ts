import { LoaderService } from './../../../core/service/loader.service';
import { CognitoUtil, Callback } from './../../../core/service/cognito/cognito.service';
import { AuthService } from './../../../core/service/auth.service';
import { Component, OnInit } from "@angular/core";
import {
    FormGroup,
    FormBuilder,
    Validators,
    FormControl,
} from "@angular/forms";
import { finalize } from 'rxjs/operators';

declare var toastr: any;

@Component({
    selector: "app-admin-user-trocar-senha",
    templateUrl: "./admin-user-trocar-senha.component.html",
    styleUrls: ["./admin-user-trocar-senha.component.css"],
})
export class AdminUserTrocarSenhaComponent implements OnInit {
    form: FormGroup;

    loading: boolean = false;

    constructor(
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private cognitoUtil: CognitoUtil,
        private loaderService: LoaderService
    ) { }

    ngOnInit(): void {
        this.form = this.formBuilder.group({
            senhaAtual: ['', [Validators.required]],
            novaSenha: ['', [Validators.required]],
            repetirSenha: ['', [Validators.required]],
        });
    }

    onSubmit() {
        if (this.form.valid) {
            if (this.form.get('novaSenha').value !== this.form.get('repetirSenha').value) {
                toastr.error('As senhas digitadas não coincidem', 'Senhas não coincidem');
                return
            }

            const callbacks: Callback = {
                callback: () => { },
                callbackWithParam: (jwt) => {
                    if (jwt) {
                        this.loading = true;
                        this.loaderService.load(true);
                        this.authService.changePassword(
                            this.form.get('senhaAtual').value,
                            this.form.get('novaSenha').value,
                            jwt
                        )
                            .pipe(
                                finalize(() => {
                                    this.loading = false;
                                    this.loaderService.load(false);
                                })
                            )
                            .subscribe({
                                next: response => {
                                    toastr.success('Senha alterada com sucesso!');
                                },
                                error: (error: any) => {
                                    const mensagem: string = error.error?.message ? error.error?.message : '';
                                    if (mensagem.includes('NotAuthorizedException')) {
                                        toastr.error('Senha atual incorreta!');
                                    } else if (mensagem.includes('LimitExceededException')) {
                                        toastr.error('Limite de tentativas atingido. Tente novamente mais tarde!');
                                    } else if (mensagem.includes('Long')) {
                                        toastr.error('A nova senha precisa ser mais longa');
                                    } else {
                                        toastr.error('Erro ao alterar senha!');
                                    }
                                }
                            })
                    }
                }
            }

            this.cognitoUtil.getAccessToken(callbacks);

        }
    }
}
