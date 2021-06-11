CREATE TABLE [dbo].[ImportHeader] (
   [ImportId] [varchar](50) NOT NULL ,
   [FileName] [varchar](200) NULL ,
   [ExecutionDate] [datetime] NULL   ,
   [ExecutionElements] [int] NULL   ,
   [ExecutionNameValues] [int] NULL   ,
   [TimeStamp] [datetime] NULL   

   ,CONSTRAINT [PK_ImportHeader] PRIMARY KEY CLUSTERED ([ImportId])
)


GO
