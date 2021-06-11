SET QUOTED_IDENTIFIER ON 
GO
SET ANSI_NULLS ON 
GO

CREATE OR ALTER PROCEDURE [dbo].[DeleteImport] (
	@ImportId Varchar(50) = NULL
	)
AS
BEGIN
	SET NOCOUNT ON

    DELETE FROM [ImportHeader]
    WHERE [ImportId] = @ImportId

    DELETE FROM [ImportElement]
    WHERE [ImportId] = @ImportId

    DELETE FROM [ImportElementNameValue]
    WHERE [ImportId] = @ImportId

    SELECT 1 AS 'result'
    
    SET NOCOUNT OFF
END

GO
SET QUOTED_IDENTIFIER OFF 
GO
SET ANSI_NULLS OFF 
GO

GO
