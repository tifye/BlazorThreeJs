using Microsoft.JSInterop;

namespace BlazorThreeJs.Components
{
    public interface IMaterialApplicable
    {
        Task SetMaterial(IMaterial mat);
    }

    public interface IMaterial
    {
        uint Id { get; }
        IJSObjectReference ObjRef { get; }
    }
}