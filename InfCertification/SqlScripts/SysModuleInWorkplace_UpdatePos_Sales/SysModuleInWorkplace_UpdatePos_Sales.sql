DECLARE @SPMId uniqueidentifier
DECLARE @GWId uniqueidentifier

 

SELECT  TOP(1) @SPMId=Id
FROM [SysModule] AS SM
WHERE SM.Caption=N'Рекламные блоки'

 

SELECT  @GWId=Id
FROM [SysWorkplace] AS SM
WHERE SM.Name=N'General'

 

if(NOT((@SPMId IS NULL) OR (@GWId IS NULL)))
BEGIN
    UPDATE SysModuleInWorkplace
    SET Position=Position+1
    WHERE SysWorkplaceId=@GWId

 

    UPDATE SysModuleInWorkplace
    SET Position=0
    WHERE SysWorkplaceId=@GWId AND SysModuleId=@SPMId
END