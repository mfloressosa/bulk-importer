CREATE TABLE [dbo].[ElementNameValue] (
   [ElementId] [varchar](50) NOT NULL ,
   [Name] [varchar](200) NOT NULL ,
   [Value] [varchar](200) NULL ,
   [TimeStamp] [datetime] NULL   

   ,CONSTRAINT [PK_ElementValue] PRIMARY KEY CLUSTERED ([ElementId], [Name])
)


GO
