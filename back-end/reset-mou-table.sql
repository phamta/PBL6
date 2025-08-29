-- Reset MOU table to fix enum migration issue
DROP TABLE IF EXISTS mous CASCADE;
DROP TYPE IF EXISTS mous_status_enum_old CASCADE;
DROP TYPE IF EXISTS mous_status_enum CASCADE;
DROP TYPE IF EXISTS mous_type_enum CASCADE;
DROP TYPE IF EXISTS mous_priority_enum CASCADE;
