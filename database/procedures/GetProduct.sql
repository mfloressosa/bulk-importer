SET QUOTED_IDENTIFIER ON 
GO
SET ANSI_NULLS ON 
GO

CREATE OR ALTER PROCEDURE [dbo].[GetProduct] (
	@ID Varchar(50) = NULL
	)
AS
BEGIN
	SET NOCOUNT ON

	SELECT
		[ID]							'id',
		[Description]					'description',
		[Currency]					    'currency',
		[CostPerUnit]				    'costPerUnit',
		[CreatedDate]					'createdDate',
		[LastModifiedDate]				'lastModifiedDate'
	FROM [Product] (NOLOCK)
	WHERE [ID] = @ID
	
	SET NOCOUNT OFF
END

GO
SET QUOTED_IDENTIFIER OFF 
GO
SET ANSI_NULLS OFF 
GO

GO
