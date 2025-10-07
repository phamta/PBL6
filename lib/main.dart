import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
// import 'package:flutter_mobile/src/ui/screens/homeguest_page.dart';
import 'src/ui/screens/login_page.dart';
import 'src/blocs/login/login_bloc.dart';
import 'src/repositories/auth_repository.dart';
import 'src/ui/screens/homeguest_page.dart';
import 'src/ui/screens/staff/homestaff_page.dart';

void main() {
  final authRepository = AuthRepository();
  runApp(
    BlocProvider(
      create: (_) => LoginBloc(authRepository),
      child: MaterialApp(
        debugShowCheckedModeBanner: false,
        home: HomeGuestPage(),
        // home: LoginScreen(),
      ),
    ),
  );
}

// class MyApp extends StatelessWidget {
//   @override
//   Widget build(BuildContext context) {
//     return BlocProvider(
//       create: (_) => LoginBloc(),
//       child: MaterialApp(
//         //
//         debugShowCheckedModeBanner: false,
//         title: 'Flutter Login',
//         theme: ThemeData(primarySwatch: Colors.blue),
//         home: LoginScreen(),
//       ),
//     );
//   }
// }
