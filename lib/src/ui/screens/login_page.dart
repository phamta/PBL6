import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../blocs/login/login_bloc.dart';
import '../../blocs/login/login_event.dart';
import '../../blocs/login/login_state.dart';
import '../screens/staff/homestaff_page.dart';
import 'homesv_page.dart';

class LoginScreen extends StatelessWidget {
  final TextEditingController phoneController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color.fromARGB(255, 18, 7, 215),
      body: Center(
        child: SingleChildScrollView(
          child: Container(
            padding: EdgeInsets.all(24),
            constraints: BoxConstraints(maxWidth: 350),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(32),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                SizedBox(height: 16),
                Text(
                  'Login',
                  style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold),
                  textAlign: TextAlign.center,
                ),
                SizedBox(height: 32),
                Text('Enter your mobile number'),
                SizedBox(height: 8),
                Row(
                  children: [
                    // DropdownButton<String>(
                    //   value: '+91',
                    //   items: [
                    //     DropdownMenuItem(child: Text('+91'), value: '+91'),
                    //   ],
                    //   onChanged: (_) {},
                    // ),
                    Expanded(
                      child: TextField(
                        controller: phoneController,
                        keyboardType: TextInputType.phone,
                        decoration: InputDecoration(
                          hintText: 'Email, điện thoại hoặc Skype...',
                          suffixIcon: Icon(
                            Icons.check_circle,
                            color: const Color.fromARGB(255, 158, 158, 158),
                          ),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
                SizedBox(height: 16),
                Text('Enter your password'),
                SizedBox(height: 8),
                BlocBuilder<LoginBloc, LoginState>(
                  builder: (context, state) {
                    return TextField(
                      controller: passwordController,
                      obscureText: true,
                      decoration: InputDecoration(
                        hintText: '************',
                        suffixIcon: Icon(Icons.visibility),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                    );
                  },
                ),
                SizedBox(height: 8),
                Align(
                  alignment: Alignment.centerRight,
                  child: TextButton(
                    onPressed: () {},
                    child: Text('forgot password?'),
                  ),
                ),
                SizedBox(height: 8),
                BlocConsumer<LoginBloc, LoginState>(
                  listener: (context, state) {
                    if (state is LoginFailure) {
                      ScaffoldMessenger.of(
                        context,
                      ).showSnackBar(SnackBar(content: Text(state.error)));
                    }
                    if (state is LoginSuccess) {
                      final user = state.user;
                      final roles = user.roles;
                      final isStaff = roles.any(
                        (role) =>
                            (role['code'] ?? role['role']?['code'] ?? '')
                                .toString()
                                .toUpperCase() ==
                            'STAFF',
                      );
                      if (isStaff) {
                        Navigator.pushReplacement(
                          context,
                          MaterialPageRoute(
                            builder: (context) =>
                                HomeStaffPage(staffName: user.fullName),
                          ),
                        );
                      } else {
                        Navigator.pushReplacement(
                          context,
                          MaterialPageRoute(
                            builder: (context) =>
                                HomeSVPage(studentName: user.fullName),
                          ),
                        );
                      }
                    }
                    // if (state is LoginSuccess) {
                    //   Navigator.pushReplacement(
                    //     context,
                    //     MaterialPageRoute(
                    //       builder: (context) =>
                    //           HomeSVPage(studentName: state.user.fullName),
                    //     ),
                    //   );
                    // }
                  },
                  builder: (context, state) {
                    return ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.black,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                        padding: EdgeInsets.symmetric(vertical: 16),
                      ),
                      onPressed: state is LoginLoading
                          ? null
                          : () {
                              print('Login button pressed');
                              BlocProvider.of<LoginBloc>(context).add(
                                LoginSubmitted(
                                  phoneController.text,
                                  passwordController.text,
                                ),
                              );
                            },
                      child: state is LoginLoading
                          ? CircularProgressIndicator(color: Colors.white)
                          : Text('Login', style: TextStyle(fontSize: 16)),
                    );
                  },
                ),
                SizedBox(height: 16),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text("Don't have an account? "),
                    GestureDetector(
                      onTap: () {},
                      child: Text(
                        'Sign Up',
                        style: TextStyle(fontWeight: FontWeight.bold),
                      ),
                    ),
                  ],
                ),
                SizedBox(height: 16),
                Divider(),
                SizedBox(height: 16),
                ElevatedButton.icon(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.white,
                    foregroundColor: Colors.black,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                    side: BorderSide(color: Colors.grey.shade300),
                  ),
                  icon: Icon(Icons.g_mobiledata, color: Colors.red),
                  label: Text('Continue with Google'),
                  onPressed: () {},
                ),
                SizedBox(height: 8),
                ElevatedButton.icon(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.white,
                    foregroundColor: Colors.black,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                    side: BorderSide(color: Colors.grey.shade300),
                  ),
                  icon: Icon(Icons.apple, color: Colors.black),
                  label: Text('Continue with Apple'),
                  onPressed: () {},
                ),
                SizedBox(height: 16),
                Divider(),
                SizedBox(height: 8),
                Center(
                  child: TextButton(
                    onPressed: () {},
                    child: Text(
                      'Continue as Guest',
                      style: TextStyle(color: Colors.grey),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
