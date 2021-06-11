SET QUOTED_IDENTIFIER ON 
GO
SET ANSI_NULLS ON 
GO

CREATE OR ALTER PROCEDURE [dbo].[BulkInsertImportElements]
AS
BEGIN
    SET NOCOUNT ON

    -- Inserto los elementos en la tabla
    INSERT INTO [ImportElement] (
        [ImportId],
        [ElementId],
        [Phone],
        [TimeStamp]
    )
    SELECT
        [ImportId],
        [ElementId],
        [Phone],
        GETUTCDATE()
    FROM [#TempImportElements] (NOLOCK)

    -- Borro la tabla temporal
    DROP TABLE [#TempImportElements]

    SET NOCOUNT OFF
END

GO
SET QUOTED_IDENTIFIER OFF 
GO
SET ANSI_NULLS OFF 
GO

GO
