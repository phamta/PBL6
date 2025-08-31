-- Create admin role if not exists
INSERT INTO role (role_id, role_name) 
SELECT gen_random_uuid(), 'admin' 
WHERE NOT EXISTS (SELECT 1 FROM role WHERE role_name = 'admin');

-- Assign admin role to admin@htqt.edu.vn user
INSERT INTO user_role (user_id, role_id)
SELECT u.user_id, r.role_id 
FROM "user" u, role r 
WHERE u.email = 'admin@htqt.edu.vn' 
AND r.role_name = 'admin'
AND NOT EXISTS (
  SELECT 1 FROM user_role ur 
  WHERE ur.user_id = u.user_id 
  AND ur.role_id = r.role_id
);
