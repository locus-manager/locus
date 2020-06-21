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

  register(register: Register) {
    const mutationUserOnPlace = gql`
      mutation userOnPlace(
          $name: String!,
          $email: String!,
          $phone: String!,
          $type: String!,
          $code: String!,
#          $checkin: String!,
      ) {
        createUserOnPlace(
            name: $name
            email: $email
            phone: $phone
            type: $type
            code: $code
#            checkIn: $checkin
        ) { id }
      }
    `;

    return this.apollo.mutate({
      mutation: mutationUserOnPlace,
      variables: register
    });
  }
}
