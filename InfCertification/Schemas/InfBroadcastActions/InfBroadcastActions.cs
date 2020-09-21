using System;
using Terrasoft.Core;
using Terrasoft.Core.Entities;

namespace Terrasoft.Configuration
{
    public class InfBroadcastActions
    {
        private const string DAILY = "6E20A69E-C1D9-4892-B21E-2B180A6FA648";
        private const string WEEKLY = "88DCD7D1-2C11-410B-AAF2-11F471CDF65A";
        private const string HOURLY = "75B8E218-1788-46A6-8FA8-591420B4E540";

        public void CreateBroadcasts(UserConnection userConnection,Guid adUnit, int numberBroadcast)
        {
            var broadcastCollection = GetSortedCollectionBroadcastByDate(userConnection, adUnit);

            var broadcastDate = broadcastCollection.Count > 0 
                    ? broadcastCollection[0].GetTypedColumnValue<DateTime>("InfBroadcastDate")
                    : DateTime.Now;

            var periodId = GetPeriodicityAdUnitId(userConnection, adUnit);
            var broadcastSchema = userConnection.EntitySchemaManager.GetInstanceByName("InfBroadcast");

            if(broadcastCollection.Count > 0)
            {
                broadcastDate = IncreaseDateByPeriod(periodId, broadcastDate);
            }

            for (int i = 0; i < numberBroadcast; i++)
            {
                var broadcastEntity = broadcastSchema.CreateEntity(userConnection);
                broadcastEntity.SetDefColumnValues();
                broadcastEntity.SetColumnValue("Id", Guid.NewGuid());
                broadcastEntity.SetColumnValue("InfAdUnitId", adUnit);
                broadcastEntity.SetColumnValue("InfBroadcastDate", broadcastDate);

                broadcastDate = IncreaseDateByPeriod(periodId, broadcastDate);

                broadcastEntity.Save();
            }
            MsgChannelUtilities.PostMessage(userConnection,"CreatedBroadcast", "Hello world");
        }

        private DateTime IncreaseDateByPeriod(string periodId, DateTime broadcastDate)
        {
            switch (periodId)
            {
                case DAILY:
                    broadcastDate = broadcastDate.AddDays(1);
                    break;
                case WEEKLY:
                    broadcastDate = broadcastDate.AddDays(7);
                    break;
                case HOURLY:
                    broadcastDate = broadcastDate.AddHours(1);
                    break;
                default:
                    throw new Exception("������������� �� ����������");
            }
            return broadcastDate;
        }

        private EntityCollection GetSortedCollectionBroadcastByDate(UserConnection userConnection, Guid adUnit)
        {
            var esqBroadcast = new EntitySchemaQuery(userConnection.EntitySchemaManager, "InfBroadcast");
            var colBroadcastDate = esqBroadcast.AddColumn("InfBroadcastDate");

            colBroadcastDate.OrderDirection = Terrasoft.Common.OrderDirection.Descending;

            var esqFilterByAdUnit = esqBroadcast.CreateFilterWithParameters(FilterComparisonType.Equal, "InfAdUnit.Id", adUnit);
            esqBroadcast.Filters.Add(esqFilterByAdUnit);

            var broadcastCollection =  esqBroadcast.GetEntityCollection(userConnection);

            return broadcastCollection;
        }

        private string GetPeriodicityAdUnitId(UserConnection userConnection, Guid adUnit)
        {
            var esqAdUnit = new EntitySchemaQuery(userConnection.EntitySchemaManager, "InfAdUnit");
            var colNamePeriodicityAdUnitId = esqAdUnit.AddColumn("InfPeriodicityAdUnit.Id").Name;

            var adUnitEntity = esqAdUnit.GetEntity(userConnection,adUnit);

            return adUnitEntity.GetTypedColumnValue<string>(colNamePeriodicityAdUnitId).ToUpper();
        }
    }
}