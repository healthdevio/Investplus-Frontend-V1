import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Forum } from "../interface/forum";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { Comments } from "../interface/comments";

@Injectable()
export class ForumService {
  constructor(private http: HttpClient) {}

  prefixPosts = "posts";

  createPost(id: number, data: Forum): Observable<Forum> {
    return this.http.post<any>(
      `${environment.url_api}/forum/companies/rounds/${id}/${this.prefixPosts}`,
      data
    );
  }

  createPostRealState(roundId: number, data: Forum): Observable<Forum> {
    return this.http.post<any>(
      `${environment.url_api}/forum/real-state/rounds/${roundId}/${this.prefixPosts}`,
      data
    );
  }

  deletePost(id: number): Observable<Forum> {
    return this.http.delete<any>(
      `${environment.url_api}/forum/${this.prefixPosts}/${id}`
    );
  }

  getPost(id: number): Observable<Forum> {
    return this.http.get<any>(
      `${environment.url_api}/forum/${this.prefixPosts}/${id}`
    );
  }

  createComment(post: number, data: Comments): Observable<Comments> {
    return this.http.post<any>(
      `${environment.url_api}/forum/${this.prefixPosts}/${post}/comments`,
      data
    );
  }

  updateComment(
    post: number,
    comment: number,
    data: Comments
  ): Observable<Comments> {
    return this.http.put<any>(
      `${environment.url_api}/forum/${this.prefixPosts}/${post}/comments/${comment}`,
      data
    );
  }

  deleteComment(post: number, comment: number): Observable<Comments> {
    return this.http.delete<any>(
      `${environment.url_api}/forum/${this.prefixPosts}/${post}/comments/${comment}`
    );
  }

  getComment(post: number, comment: number): Observable<Comments> {
    return this.http.get<any>(
      `${environment.url_api}/forum/${this.prefixPosts}/${post}/comments/${comment}`
    );
  }
}
