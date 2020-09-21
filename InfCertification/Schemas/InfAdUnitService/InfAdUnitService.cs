namespace Terrasoft.Configuration.AdUnit
{
	
    using ServiceStack.Common;
    using System;
    using System.Linq;
    using System.ServiceModel;
    using System.ServiceModel.Activation;
    using System.ServiceModel.Web;
    using Terrasoft.Core;
    using Terrasoft.Core.Entities;
    using Terrasoft.Web.Common;

    [ServiceContract]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Required)]
    public class AdUnitService : BaseService
    {
        [OperationContract]
        [WebInvoke(Method = "POST", RequestFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.Wrapped, ResponseFormat = WebMessageFormat.Json)]
        public decimal GetSumCostBroadcastComplitedByAdUnit(string code)
        {
            
            if(code.IsEmpty())
            {
                return -1;
            }

            decimal result = 0;
            var esqAdUnit = new EntitySchemaQuery(UserConnection.EntitySchemaManager, "InfAdUnit");

            var colNameAdUnitId = esqAdUnit.AddColumn("Id").Name;
            esqAdUnit.AddColumn("InfCode");

            var esqFilterByCode = esqAdUnit.CreateFilterWithParameters(FilterComparisonType.Equal, "InfCode", code);

            esqAdUnit.Filters.Add(esqFilterByCode);

            var entities = esqAdUnit.GetEntityCollection(UserConnection);

            if (entities.Count > 0)
            {
                foreach (var item in entities)
                {
                      result += getSumCostBroadcastsComplited(item.GetTypedColumnValue<Guid>(colNameAdUnitId));
                }
            }
            else
            {
                result = -1;
            }
            return result;
        }

        private decimal getSumCostBroadcastsComplited(Guid adUnitId)
        {
            decimal result = 0;
            var broadcastCollection = GetEntityCollectionBroadcastsComplited(adUnitId);
            if(broadcastCollection.Count > 0)
            {
                foreach (var broadcast in broadcastCollection)
                {
                    result += broadcast.GetTypedColumnValue<decimal>("InfCost");
                }
            }
            return result;
        }

        private EntityCollection GetEntityCollectionBroadcastsComplited(Guid adUnitId)
        {
            Guid stateComplitedId = new Guid("54FFB69B-617B-4B53-87C9-38192100AF00");

            var esqBroadcast = new EntitySchemaQuery(UserConnection.EntitySchemaManager, "InfBroadcast");
            esqBroadcast.AddColumn("InfAdUnit.Id");
            esqBroadcast.AddColumn("InfCost");

            var esqFilterByAdUnit = esqBroadcast.CreateFilterWithParameters(FilterComparisonType.Equal, "InfAdUnit.Id", adUnitId);
            var esqFilterComlited = esqBroadcast.CreateFilterWithParameters(FilterComparisonType.Equal, "InfBroadcastState.Id", stateComplitedId);

            esqBroadcast.Filters.Add(esqFilterByAdUnit);
            esqBroadcast.Filters.Add(esqFilterComlited);

            return esqBroadcast.GetEntityCollection(UserConnection);
        }
    }
}