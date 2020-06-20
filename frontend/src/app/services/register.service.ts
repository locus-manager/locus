import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Register } from '../models/app.model';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private apollo: Apollo) {}

  register(register: Register) {
    const mutationUserOnPlace = gql`
      mutation userOnPlace(
          $name: String!,
          $email: String!,
          $phone: String!,
          $type: String!,
          $code: String!
      ) {
        createUserOnPlace(
            name: $name
            email: $email
            phone: $phone
            type: $type
            code: $code
        ) { id }
      }
    `;

    return this.apollo.mutate({
      mutation: mutationUserOnPlace,
      variables: register
    });
  }
}
