import "./css/style.sass";
import NodeID from "./NodeID.tsx"
// import NodeHealth from "./NodeHealth.tsx"
import NodeBootstrapped from "./NodeBootstrapped.tsx"
function App() {
  return (
    <div className="App">
      <header className="App-header">
      <section className="is-medium has-text-white">
      <h3 className="is-size-3 has-text-white">Node info</h3>
      <NodeID />
      {/* <NodeHealth /> */}
      <h3 className="is-size-3 has-text-white">Node status</h3>
      <NodeBootstrapped chain="X"/>
      <NodeBootstrapped chain="P"/>
      <NodeBootstrapped chain="C"/>
      </section>
      </header>
    </div>
  );
}

export default App;
