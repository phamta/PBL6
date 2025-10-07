import 'package:flutter/material.dart';

class HomeStaffPage extends StatelessWidget {
  final String staffName;
  const HomeStaffPage({required this.staffName, Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: const Color.fromARGB(255, 31, 84, 219),
        elevation: 0,
        leading: IconButton(
          icon: Icon(Icons.menu, color: Colors.white),
          onPressed: () {},
        ),
        title: Text(
          staffName,
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
        ),
        actions: [
          IconButton(
            icon: Icon(Icons.notifications, color: Colors.white),
            onPressed: () {},
          ),
        ],
      ),
      backgroundColor: Color.fromARGB(255, 226, 229, 238),
      body: SingleChildScrollView(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Top stats
            Row(
              children: [
                _StatCard(
                  title: 'Đơn của đơn vị',
                  value: '127',
                  subtitle: 'Đang xử lý',
                  icon: Icons.assignment,
                ),
                SizedBox(width: 16),
                _StatCard(
                  title: 'Biên bản MOU',
                  value: '18',
                  subtitle: 'Hoạt động',
                  icon: Icons.description,
                ),
              ],
            ),
            SizedBox(height: 24),
            // Tạo mới
            Text(
              'Tạo mới',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
            ),
            SizedBox(height: 12),
            GridView.count(
              crossAxisCount: 2,
              shrinkWrap: true,
              physics: NeverScrollableScrollPhysics(),
              mainAxisSpacing: 16,
              crossAxisSpacing: 16,
              childAspectRatio: 1.3,
              children: [
                _CreateCard(icon: Icons.language, label: 'Tạo đơn xin Visa'),
                _CreateCard(
                  icon: Icons.insert_drive_file,
                  label: 'Tạo Biên bản MOU',
                ),
                _CreateCard(icon: Icons.translate, label: 'Yêu cầu dịch thuật'),
                _CreateCard(icon: Icons.group_add, label: 'Đăng ký khách'),
              ],
            ),
            SizedBox(height: 24),
            // Trạng thái gần đây
            Text(
              'Trạng thái gần đây',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
            ),
            SizedBox(height: 12),
            Container(
              padding: EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black12,
                    blurRadius: 8,
                    offset: Offset(0, 2),
                  ),
                ],
              ),
              child: Column(
                children: [
                  _RecentStatusItem(
                    title: 'Đơn Visa #2024-001',
                    subtitle: 'Xin visa công tác nước ngoài',
                    status: 'Đang xử lý',
                    statusColor: Color(0xFFFFE0B2),
                    statusTextColor: Colors.orange,
                  ),
                  Divider(),
                  _RecentStatusItem(
                    title: 'MOU với ĐH ABC',
                    subtitle: 'Hợp tác nghiên cứu khoa học',
                    status: 'Đang thực hiện',
                    statusColor: Color(0xFFBBDEFB),
                    statusTextColor: Color(0xFF1976D2),
                  ),
                  Divider(),
                  _RecentStatusItem(
                    title: 'Dịch thuật tài liệu',
                    subtitle: 'Tài liệu hội thảo quốc tế',
                    status: 'Đang xử lý',
                    statusColor: Color(0xFFFFE0B2),
                    statusTextColor: Colors.orange,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _StatCard extends StatelessWidget {
  final String title;
  final String value;
  final String subtitle;
  final IconData icon;
  const _StatCard({
    required this.title,
    required this.value,
    required this.subtitle,
    required this.icon,
  });
  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Container(
        padding: EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: Colors.black12,
              blurRadius: 8,
              offset: Offset(0, 2),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(icon, color: Colors.blue),
                SizedBox(width: 8),
                Text(title, style: TextStyle(fontWeight: FontWeight.bold)),
              ],
            ),
            SizedBox(height: 12),
            Text(
              value,
              style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 4),
            Text(subtitle, style: TextStyle(color: Colors.grey)),
          ],
        ),
      ),
    );
  }
}

class _CreateCard extends StatelessWidget {
  final IconData icon;
  final String label;
  const _CreateCard({required this.icon, required this.label});
  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(color: Colors.black12, blurRadius: 8, offset: Offset(0, 2)),
        ],
      ),
      child: InkWell(
        borderRadius: BorderRadius.circular(16),
        onTap: () {},
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, color: Colors.blue, size: 32),
            SizedBox(height: 12),
            Text(label, style: TextStyle(fontWeight: FontWeight.bold)),
          ],
        ),
      ),
    );
  }
}

class _RecentStatusItem extends StatelessWidget {
  final String title;
  final String subtitle;
  final String status;
  final Color statusColor;
  final Color statusTextColor;
  const _RecentStatusItem({
    required this.title,
    required this.subtitle,
    required this.status,
    required this.statusColor,
    required this.statusTextColor,
  });
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.symmetric(vertical: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: TextStyle(fontWeight: FontWeight.bold)),
                SizedBox(height: 2),
                Text(subtitle, style: TextStyle(color: Colors.grey)),
              ],
            ),
          ),
          Container(
            padding: EdgeInsets.symmetric(horizontal: 12, vertical: 4),
            decoration: BoxDecoration(
              color: statusColor,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Text(
              status,
              style: TextStyle(
                color: statusTextColor,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
