export class ResponseMessage {
  static created(entity: string): string {
    return `${entity} created successfully.`;
  }

  static updated(entity: string): string {
    return `${entity} updated successfully.`;
  }

  static deleted(entity: string): string {
    return `${entity} deleted successfully.`;
  }

  static loggedInSuccessfully(): string {
    return `User logged in successfully.`;
  }

  static registeredSuccessfully(): string {
    return 'User registered successfully';
  }

  static fetchedSuccessfully(entity: string): string {
    return `${entity} fetched successfully`;
  }

  static uploadedSuccessfully(entity: string): string {
    return `${entity} uploaded successfully`;
  }
  static sentSuccessfully(entity: string): string {
    return `${entity} sent successfully`;
  }
}
