using Microsoft.JSInterop;

namespace BlazorThreeJs.Components
{
    public interface IMaterialApplicable
    {
        Task SetMaterial(IMaterial mat);
    }

    public interface IMaterial
    {
        IJSObjectReference ObjRef { get; }
    }
}