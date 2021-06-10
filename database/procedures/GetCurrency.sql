SET QUOTED_IDENTIFIER ON 
GO
SET ANSI_NULLS ON 
GO

CREATE OR ALTER PROCEDURE [dbo].[GetCurrency] (
	@ID Varchar(50) = NULL
	)
AS
BEGIN
	SET NOCOUNT ON

	SELECT
		[ID]							'id',
		[Description]					'description',
		[ExchangeRate]					'exchangeRate',
		[CreatedDate]					'createdDate',
		[LastModifiedDate]				'lastModifiedDate'
	FROM [Currency] (NOLOCK)
	WHERE [ID] = @ID
	
	SET NOCOUNT OFF
END

GO
SET QUOTED_IDENTIFIER OFF 
GO
SET ANSI_NULLS OFF 
GO

GO
