A proof of concept I made in my free time for my work at Husqvarna Robotics R&D. This is a continuation of https://github.com/tifye/SimulatorBlazorComponents but its no longer tied to any of our internal stuff but instead more generic 3D components and uses ThreeJs instead of Unity. The goal with this was to further simplify working with 3D in Blazor projects and to save money on Unity licensing.

Sample
```razor
<Renderer Width="1000" Height="1000">
    <Scene>
        <Camera Z="60" Y="25" Context="Cam">
            <OrbitControls Camera="Cam" AutoRotate="true" />
        </Camera>
        <HemisphereLight SkyColor="Color.White" GroundColor="Color.White" Intesity="0.05f" />
        <PointLight Y="15" Decay="0.5f" Distance="100" />
        <PointLight CastShadow Y="75" Color="Color.SkyBlue" Intesity="0.25f" Decay="0.25f" Distance="0" />
        <SpotLight @ref="blueLight" CastShadow Color="Color.Blue" Y="45" X="80" Penumbra="0.59f" Distance="500"
            Decay="0.25f" Angle="MathF.PI/4">
            <SpotLightHelper LiveUpdate />
        </SpotLight>
        <SpotLight @ref="redLight" CastShadow Color="Color.Red" Intesity="2" Y="25" X="-80" Penumbra="0.99f"
            Distance="500" Decay="0.25f" Angle="MathF.PI/4">
            <SpotLightHelper LiveUpdate />
        </SpotLight>

        <TheSquad />

        <Mesh RotationX="-MathF.PI /2">
            <PlaneGeometry Width="10000" Height="10000" />
            <MeshPhongMaterial Color="Color.White" />
        </Mesh>
    </Scene>
</Renderer>

@code {
    // ...

    [JSInvokable]
    public async Task OnAnimationFrame(double delta)
    {
        TimeSpan eslaped = DateTime.Now - firstTick;
        float speed = 0.25f;
        //float x = MathF.Cos((float)eslaped.TotalSeconds * speed) * 80;
        //float y = MathF.Sin((float)eslaped.TotalSeconds * speed) * 80;

        float lx = (float)(Math.Cos(angle) * 80);
        float ly = (float)(Math.Sin(angle) * 80);

        await blueLight.SetPosition(lx, blueLight.Y, ly);
        await redLight.SetPosition(-lx, blueLight.Y, -ly);
    }

    // ...
}
```
