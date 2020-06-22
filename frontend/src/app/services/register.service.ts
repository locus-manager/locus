import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Register } from '../models/app.model';
import { pluck } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private apollo: Apollo) {}

  verifyActiveCheckin(email: string) {
    const queryActiveCheckin = gql`
      query activeCheckIn($email: String!) {
        activeCheckin(email: $email) { id }
      }
    `;

    return this.apollo.query({
      query: queryActiveCheckin,
      variables: { email }
    }).pipe(pluck('data', 'activeCheckin'));
  }

  createSession(register: Register) {
    const mutationCreateSession = gql`
      mutation createSession(
          $name: String!,
          $email: String!,
          $phone: String!,
          $type: String!,
          $code: String!,
          $checkin: String!,
      ) {
        createSession(
            name: $name
            email: $email
            phone: $phone
            type: $type
            code: $code
            checkin: $checkin
        ) { id }
      }
    `;

    return this.apollo.mutate({
      mutation: mutationCreateSession,
      variables: register
    });
  }
}
