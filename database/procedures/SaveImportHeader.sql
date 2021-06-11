SET QUOTED_IDENTIFIER ON 
GO
SET ANSI_NULLS ON 
GO

CREATE OR ALTER PROCEDURE [dbo].[SaveImportHeader] (
	@ImportId Varchar(50) = NULL,           @FileName Varchar(200) = NULL,          @ExecutionDate Datetime = NULL,
    @ExecutionElements Int = NULL,          @ExecutionNameValues Int = NULL
	)
AS
BEGIN
	SET NOCOUNT ON
	
	UPDATE [ImportHeader]
	SET [FileName] = @FileName,
		[ExecutionDate] = @ExecutionDate,
		[ExecutionElements] = @ExecutionElements,
		[ExecutionNameValues] = @ExecutionNameValues,
		[TimeStamp] = GETUTCDATE()
	WHERE [ImportId] = @ImportId

    IF @@ROWCOUNT = 0
		INSERT INTO [ImportHeader] (
			[ImportId], [FileName], [ExecutionDate],
            [ExecutionElements], [ExecutionNameValues], [TimeStamp]
			)
		VALUES (
			@ImportId, @FileName, @ExecutionDate,
            @ExecutionElements, @ExecutionNameValues, GETUTCDATE()
		)
		
    SELECT 1 AS 'result'
    
    SET NOCOUNT OFF
END

GO
SET QUOTED_IDENTIFIER OFF 
GO
SET ANSI_NULLS OFF 
GO

GO
