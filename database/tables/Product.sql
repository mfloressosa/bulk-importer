CREATE TABLE [dbo].[Product] (
   [ID] [varchar](50) NOT NULL ,
   [Description] [varchar](200) NULL ,
   [Currency] [varchar](50) NULL ,
   [CostPerUnit] [numeric](10,5) NULL  ,
   [CreatedDate] [datetime] NULL   ,
   [LastModifiedDate] [datetime] NULL   ,
   [TimeStamp] [datetime] NULL   

   ,CONSTRAINT [PK_Product] PRIMARY KEY CLUSTERED ([ID])
)


GO
