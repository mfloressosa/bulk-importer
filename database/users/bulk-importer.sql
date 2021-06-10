CREATE USER [bulk-importer] WITHOUT LOGIN WITH DEFAULT_SCHEMA = dbo
/*ALTER ROLE db_owner ADD MEMBER bulk-importer*/ exec sp_addrolemember 'db_owner', 'bulk-importer'
GO
