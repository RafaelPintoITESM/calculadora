<script lang="ts">
    interface Tasa {
      valor: number;
      tipoTasa: number;
      tasaDecimal: number;
      parent?: Tasa;
      hijos: Tasa[];
    }
  
    let valorPago = 0;
    let tasas: Tasa[] = [];
  
    const tiposTasas = { porMil: 1, porcentaje: 2 };
    const opcionesTasas = [
      { id: tiposTasas.porMil, label: "‰" },
      { id: tiposTasas.porcentaje, label: "%" }
    ];
  
    function crearTasa() {
      const nueva: Tasa = { valor: 0, tipoTasa: tiposTasas.porMil, tasaDecimal: 0, hijos: [] };
      tasas = [...tasas, nueva];
    }
  
    function crearTasaHija(tasa: Tasa) {
      const hijo: Tasa = { valor: 0, tipoTasa: tiposTasas.porMil, tasaDecimal: 0, parent: tasa, hijos: [] };
      tasa.hijos = [...tasa.hijos, hijo];
      tasas = [...tasas];
    }
  
    function calcularDecimal(t: Tasa): number {
      const base = t.tipoTasa === tiposTasas.porMil ? t.valor / 1000 : t.valor / 100;
      return t.parent ? base * t.parent.tasaDecimal : base;
    }
  
    let sumaTasas = 0;
    let valorBase = 0;
  
    $: if (tasas) {
      sumaTasas = 0;
      for (const tasa of tasas) {
        tasa.tasaDecimal = calcularDecimal(tasa);
        sumaTasas += tasa.tasaDecimal;
        for (const hijo of tasa.hijos) {
          hijo.tasaDecimal = calcularDecimal(hijo);
          sumaTasas += hijo.tasaDecimal;
        }
      }
      valorBase = valorPago / (1 - (sumaTasas || 0));
    }
  </script>
  
  <div class="container my-4">
    <div class="card shadow-sm">
      <div class="card-body">
        <h5 class="card-title">Calculadora de Tasas</h5>
  
        <div class="mb-3 row">
          <label class="col-sm-2 col-form-label">Valor a pagar</label>
          <div class="col-sm-4">
            <input
              type="number"
              class="form-control"
              bind:value={valorPago}
              placeholder="Ingrese monto"
            />
          </div>
        </div>
  
        <button class="btn btn-primary mb-4" on:click={crearTasa}>
          <i class="bi bi-plus-lg"></i> Agregar Tasa
        </button>
  
        {#each tasas as tasa (tasa)}
          <div class="card mb-3">
            <div class="card-body">
              <div class="row g-2 align-items-center">
                <div class="col-auto">
                  <input
                    type="number"
                    class="form-control"
                    bind:value={tasa.valor}
                    placeholder="Valor tasa"
                  />
                </div>
  
                <div class="col-auto">
                  <select class="form-select" bind:value={tasa.tipoTasa}>
                    {#each opcionesTasas as op}
                      <option value={op.id}>{op.label}</option>
                    {/each}
                  </select>
                </div>
  
                <div class="col-auto">
                  <button class="btn btn-outline-success" on:click={() => crearTasaHija(tasa)}>
                    <i class="bi bi-plus-circle"></i>
                  </button>
                </div>
  
                <div class="col">
                  <span class="fw-semibold">
                    {tasa.tasaDecimal.toFixed(4)}
                  </span>
                </div>
              </div>
  
              {#each tasa.hijos as hijo (hijo)}
                <div class="row g-2 align-items-center mt-2 ps-4 border-start">
                  <div class="col-auto">
                    <input
                      type="number"
                      class="form-control"
                      bind:value={hijo.valor}
                      placeholder="Valor hijo"
                    />
                  </div>
  
                  <div class="col-auto">
                    <select class="form-select" bind:value={hijo.tipoTasa}>
                      {#each opcionesTasas as op}
                        <option value={op.id}>{op.label}</option>
                      {/each}
                    </select>
                  </div>
  
                  <div class="col">
                    <span class="text-muted">
                      {hijo.tasaDecimal.toFixed(4)}
                    </span>
                  </div>
                </div>
              {/each}
            </div>
          </div>
        {/each}
  
        <div class="row mt-3">
          <div class="col-sm-6">
            <p><strong>Tasa total:</strong> {sumaTasas.toFixed(4)}</p>
          </div>
          <div class="col-sm-6">
            <p><strong>Base calculada:</strong> {valorBase.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  