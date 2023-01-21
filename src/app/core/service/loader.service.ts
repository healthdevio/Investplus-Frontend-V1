import { Injectable, OnDestroy } from '@angular/core';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { Subject, Subscription } from 'rxjs';

@Injectable()
export class LoaderService implements OnDestroy {

    loading = new Subject<boolean>();
    $subscription: Subscription;

    constructor(

    ) {
        this.$subscription = this.loading.subscribe({
            next: value => {
                if (value) {
                    NProgress.start();
                    NProgress.set(0.1);
                    NProgress.inc();
                } else {
                    NProgress.done();
                }
            }
        })
    }

    ngOnDestroy(): void {
        this.$subscription.unsubscribe();
    }

    load(value: boolean = true) {
        this.loading.next(value);
    }
}
