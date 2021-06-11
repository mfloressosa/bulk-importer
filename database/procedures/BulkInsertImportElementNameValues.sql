SET QUOTED_IDENTIFIER ON 
GO
SET ANSI_NULLS ON 
GO

CREATE OR ALTER PROCEDURE [dbo].[BulkInsertImportElementNameValues]
AS
BEGIN
    SET NOCOUNT ON

    -- Inserto los elementos en la tabla
    INSERT INTO [ImportElementNameValue] (
        [ImportId],
        [ElementId],
        [Name],
        [Value],
        [TimeStamp]
    )
    SELECT
        [ImportId],
        [ElementId],
        [Name],
        [Value],
        GETUTCDATE()
    FROM [#TempImportElementNameValues] (NOLOCK)

    -- Borro la tabla temporal
    DROP TABLE [#TempImportElementNameValues]

    SET NOCOUNT OFF
END

GO
SET QUOTED_IDENTIFIER OFF 
GO
SET ANSI_NULLS OFF 
GO

GO
