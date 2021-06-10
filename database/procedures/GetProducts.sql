SET QUOTED_IDENTIFIER ON 
GO
SET ANSI_NULLS ON 
GO

CREATE OR ALTER PROCEDURE [dbo].[GetProducts] (
	@ID Varchar(50) = NULL,       @Description Varchar(200)= NULL
	)
AS
BEGIN
	SET NOCOUNT ON

	-- Si algun filtro de texto me llego null lo inicializo a vacio
	SELECT	@ID = ISNULL(@ID, ''),
			@Description = ISNULL(@Description, '')

	-- Ejecuto la búsqueda y devuelvo resultados
	SELECT
		[ID]							'id',
		[Description]					'description',
		[Currency]					    'currency',
		[CostPerUnit]				    'costPerUnit',
		[CreatedDate]					'createdDate',
		[LastModifiedDate]				'lastModifiedDate'
	FROM [Product] (NOLOCK)
	WHERE ISNULL([ID], '') LIKE CASE WHEN @ID <> '' THEN '%' + @ID + '%' ELSE ISNULL([ID], '') END COLLATE Latin1_general_CI_AI
	AND [Description] LIKE CASE WHEN @Description <> '' THEN '%' + @Description + '%' ELSE [Description] END COLLATE Latin1_general_CI_AI

	SET NOCOUNT OFF
END

GO
SET QUOTED_IDENTIFIER OFF 
GO
SET ANSI_NULLS OFF 
GO

GO
