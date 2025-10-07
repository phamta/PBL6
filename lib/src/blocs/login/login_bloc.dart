// import 'package:flutter_bloc/flutter_bloc.dart';
// import 'login_event.dart';
// import 'login_state.dart';

// class LoginBloc extends Bloc<LoginEvent, LoginState> {
//   LoginBloc() : super(LoginInitial());

//   @override
//   Stream<LoginState> mapEventToState(LoginEvent event) async* {
//     if (event is LoginSubmitted) {
//       yield LoginLoading();
//       // Simulate login logic
//       await Future.delayed(Duration(seconds: 2));
//       if (event.phone == '1712345678' && event.password == 'password') {
//         yield LoginSuccess();
//       } else {
//         yield LoginFailure('Invalid phone or password');
//       }
//     }
//   }
// }

import 'package:flutter_bloc/flutter_bloc.dart';
import 'login_event.dart';
import 'login_state.dart';

import '../../repositories/auth_repository.dart';
import '../../models/user_model.dart';

class LoginBloc extends Bloc<LoginEvent, LoginState> {
  final AuthRepository authRepository;
  LoginBloc(this.authRepository) : super(LoginInitial()) {
    on<LoginSubmitted>((event, emit) async {
      emit(LoginLoading());
      try {
        print('LoginSubmitted event received');
        final result = await authRepository.login(event.phone, event.password);

        print('DEBUG result: $result');
        // if (result != null &&
        //     result['success'] == true &&
        //     result['data'] != null &&
        //     result['data']['accessToken'] != null) {
        //   await authRepository.saveTokens(
        //     result['data']['accessToken'],
        //     result['data']['refreshToken'],
        //   );
        //   await authRepository.saveTokens(
        //     result['accessToken'],
        //     result['refreshToken'],
        //   );
        //   emit(LoginSuccess(user: result['user']));
        // } else {
        //   emit(
        //     LoginFailure(result?['message'] ?? 'Sai tài khoản hoặc mật khẩu'),
        //   );
        // }
        if (result != null &&
            result['user'] != null &&
            result['accessToken'] != null) {
          await authRepository.saveTokens(
            result['accessToken'],
            result['refreshToken'],
          );
          emit(LoginSuccess(user: result['user']));
        } else {
          emit(LoginFailure('Sai tài khoản hoặc mật khẩu'));
        }
      } catch (e) {
        emit(LoginFailure('Lỗi kết nối server'));
      }
    });
  }
}
