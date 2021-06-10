CREATE TABLE [dbo].[Currency] (
   [ID] [varchar](50) NOT NULL ,
   [Description] [varchar](200) NULL ,
   [ExchangeRate] [numeric](10,5) NULL  ,
   [CreatedDate] [datetime] NULL   ,
   [LastModifiedDate] [datetime] NULL   ,
   [TimeStamp] [datetime] NULL   

   ,CONSTRAINT [PK_Currency] PRIMARY KEY CLUSTERED ([ID])
)


GO
