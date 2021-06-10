SET QUOTED_IDENTIFIER ON 
GO
SET ANSI_NULLS ON 
GO

CREATE OR ALTER PROCEDURE [dbo].[SaveProduct] (
	@ID Varchar(50) = NULL, 			@Description Varchar(200) = NULL,   @Currency Varchar(50) = NULL,
    @CostPerUnit Numeric(10, 5) = NULL, @CreatedDate Datetime = NULL,       @LastModifiedDate Datetime = NULL
	)
AS
BEGIN
	SET NOCOUNT ON
	
	UPDATE [Product]
	SET [Description] = @Description,
		[Currency] = @Currency,
		[CostPerUnit] = @CostPerUnit,
		[CreatedDate] = CASE WHEN @CreatedDate IS NULL THEN [CreatedDate] ELSE @CreatedDate END,
		[LastModifiedDate] = CASE WHEN @LastModifiedDate IS NULL THEN [LastModifiedDate] ELSE @LastModifiedDate END,
		[TimeStamp] = GETUTCDATE()
	WHERE [ID] = @ID

    IF @@ROWCOUNT = 0
		INSERT INTO [Product] (
			[ID], [Description], [Currency],
            [CostPerUnit], [CreatedDate], [LastModifiedDate],
            [TimeStamp]
			)
		VALUES (
			@ID, @Description, @Currency,
            @CostPerUnit, @CreatedDate, @LastModifiedDate,
            GETUTCDATE()
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
