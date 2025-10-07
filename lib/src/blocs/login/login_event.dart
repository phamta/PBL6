abstract class LoginEvent {}

class LoginSubmitted extends LoginEvent {
  final String phone;
  final String password;
  LoginSubmitted(this.phone, this.password);
}
