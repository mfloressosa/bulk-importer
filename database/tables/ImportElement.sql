CREATE TABLE [dbo].[ImportElement] (
   [ImportId] [varchar](50) NOT NULL ,
   [ElementId] [varchar](50) NOT NULL ,
   [Phone] [varchar](200) NULL ,
   [TimeStamp] [datetime] NULL   

   ,CONSTRAINT [PK_ImportElement] PRIMARY KEY CLUSTERED ([ImportId], [ElementId])
)


GO
