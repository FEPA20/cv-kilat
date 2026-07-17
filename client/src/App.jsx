import LightningButton from "./components/ui/LightningButton";
import LightningContainer from "./components/ui/LightningContainer";

function App() {
  return (
    <div className="min-h-screen bg-slate-50">

      <LightningContainer>

        <div className="flex flex-col items-center justify-center min-h-screen">

          <h1 className="text-5xl font-bold text-slate-900 mb-6">
            ⚡ CV Kilat
          </h1>

          <p className="text-slate-600 mb-10">
            CV Profesional dalam Hitungan Menit
          </p>

          <LightningButton>
            Buat CV Sekarang
          </LightningButton>

        </div>

      </LightningContainer>

    </div>
  );
}

export default App;