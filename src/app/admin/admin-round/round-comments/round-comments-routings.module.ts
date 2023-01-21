import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoundCommentsEditComponent } from './round-comments-edit/round-comments-edit.component';
import { RoundCommentsComponent } from './round-comments/round-comments.component';

const routes: Routes = [
    {
        path: ":roundId/forum/:postId",
        component: RoundCommentsComponent,
        data: { scopes: ["ROLE_INVESTOR"] },
    },
    {
        path: ":roundId/forum/:postId/comment/:commentId",
        component: RoundCommentsEditComponent,
        data: { scopes: ["ROLE_INVESTOR"] },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AdminRoundCommentsRoutingModule { }
