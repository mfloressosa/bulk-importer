CREATE USER [inconcert] WITHOUT LOGIN WITH DEFAULT_SCHEMA = dbo
/*ALTER ROLE db_owner ADD MEMBER inconcert*/ exec sp_addrolemember 'db_owner', 'inconcert'
GO
