#!/bin/bash

# Script để cập nhật role migration tự động
# Chạy script này để thay thế tất cả UserRole.KHOA và UserRole.PHONG

echo "Starting role migration..."

# Mapping:
# KHOA -> MANAGER (Lãnh đạo Phòng)
# PHONG -> SPECIALIST (Chuyên viên)

# Cập nhật database seeder
sed -i 's/UserRole\.KHOA/UserRole.MANAGER/g' src/database/database-seeder.service.ts
sed -i 's/UserRole\.PHONG/UserRole.SPECIALIST/g' src/database/database-seeder.service.ts

# Cập nhật visa extension
sed -i 's/UserRole\.KHOA/UserRole.MANAGER/g' src/modules/visa-extension/visa-extension.service.ts
sed -i 's/UserRole\.PHONG/UserRole.SPECIALIST/g' src/modules/visa-extension/visa-extension.service.ts
sed -i 's/UserRole\.PHONG/UserRole.SPECIALIST/g' src/modules/visa-extension/visa-extension.controller.ts
sed -i 's/UserRole\.PHONG/UserRole.SPECIALIST/g' src/modules/visa-extension/visa-extension-document.service.ts

# Cập nhật translation
sed -i 's/UserRole\.KHOA/UserRole.MANAGER/g' src/modules/translation/translation.controller.ts
sed -i 's/UserRole\.PHONG/UserRole.SPECIALIST/g' src/modules/translation/translation.controller.ts

# Cập nhật visa
sed -i 's/UserRole\.KHOA/UserRole.MANAGER/g' src/modules/visa/visa.controller.ts
sed -i 's/UserRole\.PHONG/UserRole.SPECIALIST/g' src/modules/visa/visa.controller.ts

# Cập nhật visitor
sed -i 's/UserRole\.KHOA/UserRole.MANAGER/g' src/modules/visitor/visitor.controller.ts
sed -i 's/UserRole\.PHONG/UserRole.SPECIALIST/g' src/modules/visitor/visitor.controller.ts

echo "Role migration completed!"
echo "Next steps:"
echo "1. Review all changed files"
echo "2. Run database migration: npm run migration:run"
echo "3. Test the application"
