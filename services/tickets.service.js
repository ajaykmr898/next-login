import { fetchWrapper } from "helpers";
import { formatDate } from "./index";

const baseUrl = `/api/tickets`;

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Set",
  "Oct",
  "Nov",
  "Dec",
];

export const ticketsService = {
  getAll,
  create,
  update,
  delete: _delete,
  upload,
  getById,
  getProfit,
  getRefundsForSupply,
  getTicketsForSupply,
};

async function getTicketsForSupply(filters = {}) {
  const response = await fetchWrapper.post(baseUrl + "/supply", filters);
  return response;
}

async function getAll(filters) {
  const response = await fetchWrapper.post(baseUrl, filters);
  const tickets = response.map((t, i) => {
    let bkd = formatDate(t.bookedOn, "IT");
    let ra1d = t.receivingAmount1Date
      ? formatDate(t.receivingAmount1Date, "IT")
      : "";
    let ra2d = t.receivingAmount2Date
      ? formatDate(t.receivingAmount2Date, "IT")
      : "";
    let ra3d = t.receivingAmount3Date
      ? formatDate(t.receivingAmount3Date, "IT")
      : "";
    let tk2 = t.paidAmount.trim() ? parseFloat(t.paidAmount) : 0;
    let tra = t.receivingAmount1.trim()
      ? (parseFloat(t.receivingAmount1) || 0) +
        (parseFloat(t.receivingAmount2) || 0) +
        (parseFloat(t.receivingAmount3) || 0)
      : 0;
    let profit = parseFloat((tra - tk2).toFixed(2));
    let methods =
      t.paymentMethod +
      (t.receivingAmount2Method ? " - " + t.receivingAmount2Method : "") +
      (t.receivingAmount3Method ? " - " + t.receivingAmount3Method : "");
    let penality = t.refund
      ? parseFloat(t.paidAmount) - parseFloat(t.refund)
      : "";
    return {
      ...t,
      profit: "€ " + profit,
      bookedOn: bkd,
      receivingAmount1Date: ra1d,
      receivingAmount2Date: ra2d,
      receivingAmount3Date: ra3d,
      idP: i + 1,
      receivingAmountT: "€ " + tra,
      paidAmount: "€ " + t.paidAmount,
      agentCost: t.agentCost ? "€ " + t.agentCost : t.agentCost,
      methods: methods,
      refund: t.refund ? "€ " + t.refund : t.refund,
      refundUsed: t.refundUsed ? "€ " + t.refundUsed : t.refundUsed,
      refundDate: t.refundDate ? formatDate(t.refundDate, "IT") : t.refundDate,
      returned: t.returned ? "€ " + t.returned : t.returned,
      returnedDate: t.returnedDate
        ? formatDate(t.returnedDate, "IT")
        : t.returnedDate,
      supplied: t.supplied ? "€ " + t.supplied : t.supplied,
      penality: penality !== "" ? "€ " + parseFloat(penality).toFixed(2) : "",
    };
  });
  return tickets;
}

async function create(ticket) {
  await fetchWrapper.post(`${baseUrl}/create`, ticket);
}

async function update(id, params) {
  await fetchWrapper.put(`${baseUrl}/${id}`, params);
}

async function _delete(id) {
  await fetchWrapper.delete(`${baseUrl}/${id}`);
}

async function getById(id) {
  return await fetchWrapper.get(`${baseUrl}/${id}`);
}

async function getRefundsForSupply(filters = {}) {
  const result = await fetchWrapper.post(baseUrl + "/refund", filters);
  return result;
}

async function getProfit(filters) {
  const result = await fetchWrapper.post(baseUrl + "/profit", filters);
  let ticketsP = {};
  let methods = {};
  let agents = {};
  let agentsP = {};
  let methodsP = {};
  let agentsA = {};
  let methodsA = {};
  result.map((ticket) => {
    let date = new Date(ticket.bookedOn);
    let key = months[date.getMonth()] + " " + date.getFullYear();
    let method1 =
      (ticket.paymentMethod && ticket.paymentMethod.trim().toUpperCase()) ||
      "None";
    let method2 =
      (ticket.receivingAmount2Method &&
        ticket.receivingAmount2Method.trim().toUpperCase()) ||
      "None";
    let method3 =
      (ticket.receivingAmount3Method &&
        ticket.receivingAmount3Method.trim().toUpperCase()) ||
      "None";
    let agent = ticket.agent.trim().toUpperCase() || "None";
    if (methods[method1] !== undefined) {
      methods[method1] += 1;
    } else {
      methods[method1] = 1;
    }
    if (agents[agent] !== undefined) {
      agents[agent] += 1;
    } else {
      agents[agent] = 1;
    }

    let totalReceivingAmount1 = parseFloat(ticket.receivingAmount1) || 0;
    let totalReceivingAmount2 = parseFloat(ticket.receivingAmount2) || 0;
    let totalReceivingAmount3 = parseFloat(ticket.receivingAmount3) || 0;
    let totalReceivingAmount =
      totalReceivingAmount1 + totalReceivingAmount2 + totalReceivingAmount3;

    let paidAmount = parseFloat(ticket.paidAmount);
    let profit = totalReceivingAmount - paidAmount;

    if (ticketsP[key] !== undefined) {
      ticketsP[key].totalReceivingAmount += totalReceivingAmount;
      ticketsP[key].paidAmount += paidAmount;
      ticketsP[key].profit += profit;
    } else {
      ticketsP[key] = { totalReceivingAmount, paidAmount, profit };
    }

    if (
      [
        "receivingAmount1Date",
        "receivingAmount2Date",
        "receivingAmount3Date",
      ].includes(filters.type)
    ) {
      if (filters.type === "receivingAmount1Date") {
        if (methodsA[method1] !== undefined) {
          methodsA[method1] += totalReceivingAmount1;
        } else {
          methodsA[method1] = totalReceivingAmount1;
        }
      }
      if (filters.type === "receivingAmount2Date") {
        if (methodsA[method2] !== undefined) {
          methodsA[method2] += totalReceivingAmount2;
        } else {
          methodsA[method2] = totalReceivingAmount2;
        }
      }
      if (filters.type === "receivingAmount3Date") {
        if (methodsA[method3] !== undefined) {
          methodsA[method3] += totalReceivingAmount3;
        } else {
          methodsA[method3] = totalReceivingAmount3;
        }
      }
    } else {
      if (methodsP[method1] !== undefined) {
        methodsP[method1] += profit;
      } else {
        methodsP[method1] = profit;
      }

      if (agentsP[agent] !== undefined) {
        agentsP[agent] += profit;
      } else {
        agentsP[agent] = profit;
      }

      if (agentsA[agent] !== undefined) {
        agentsA[agent] += totalReceivingAmount;
      } else {
        agentsA[agent] = totalReceivingAmount;
      }

      if (methodsA[method1] !== undefined) {
        methodsA[method1] += totalReceivingAmount1;
      } else {
        methodsA[method1] = totalReceivingAmount1;
      }
      if (methodsA[method2] !== undefined) {
        methodsA[method2] += totalReceivingAmount2;
      } else {
        methodsA[method2] = totalReceivingAmount2;
      }
      if (methodsA[method3] !== undefined) {
        methodsA[method3] += totalReceivingAmount3;
      } else {
        methodsA[method3] = totalReceivingAmount3;
      }
    }
  });
  return { ticketsP, methods, methodsP, agents, agentsP, agentsA, methodsA };
}

async function upload(files) {
  let fc = [];
  files.map((ct) => {
    let final = [];
    const dr = ct.split("\n").map(function (ln) {
      return ln.split(";");
    });

    dr.map((dC) => {
      let manipulated = [];
      dC.map((cl) => {
        cl = cl.trim();
        if (cl) {
          manipulated.push(cl);
        }
      });
      final.push(manipulated);
    });

    // console.log(final, final.length);
    let iac = { 38286592: "SCA" };
    let agl = { A723: "ASHU", S475: "SONU", M277: "MALI" };
    let ard = [];
    let t = [];
    let n = [];
    let ia =
      final.hasOwnProperty(3) && final[3].hasOwnProperty(6) ? final[3][6] : "-";
    let c2 = "-";
    let ag = "";
    let ac = "";
    let mt = "";
    let d = "-";
    let dor = "-";
    let tk = "";
    let tk2 = "";
    let tra = "";
    let tra1D = "";
    let tra2D = "";
    let tra3D = "";
    let pr = 0;
    let tn = "";
    let tc = "-";
    let cn = "-";
    let p = "-";
    let f =
      final.hasOwnProperty(4) && final[4].hasOwnProperty(0) ? final[4][0] : "-";

    for (let r = 0; r < final.length; r++) {
      for (let c = 0; c < final[r].length; c++) {
        if (final[r][c].includes("I-00")) {
          n.push(final[r][c + 1].replace(/[^a-zA-Z ]/g, " ").trim());
        }
        if (final[r][c].includes("T-K")) {
          t.push(final[r][c].replace("T-K", "").trim());
        }
        if (final[r][c].includes("MUC1A")) {
          c2 = final[r][c].replace("MUC1A ", "").trim();
          c2 = c2.slice(0, -3);
        }
        if (final[r][c].includes("RM*A*")) {
          ag = final[r][c].replace("RM*A*", "");
        }
        if (final[r][c].includes("RM*AC*")) {
          ac = final[r][c].replace("RM*AC*", "");
          ac = ac.trim() ? parseFloat(ac) : 0;
        }
        if (final[r][c].includes("RM*P*")) {
          mt = final[r][c].replace("RM*P*", "");
        }
        if (final[r][c].includes("D-")) {
          let dates = final[r];
          let datesC = dates.length;
          d = dates[datesC - 1].replace("D-", "").trim();
          dor = d;
          if (d.length === 6) {
            let y = "20" + d[0] + d[1];
            let m = d[2] + d[3];
            let g = d[4] + d[5];
            d = `${y}-${m}-${g}`;
          } else {
            d = formatDate(new Date());
          }
        }
        if (final[r][c].includes("K-F")) {
          if (final[r][c].includes("K-FEUR")) {
            tk = final[r][c].replace("K-FEUR", "").trim();
            tk2 = final[r][c + 1].replace("EUR", "").trim();
          } else {
            tk = final[r][c + 1].replace("K-FEUR", "").trim();
            tk2 = final[r][c + 2].replace("EUR", "").trim();
          }
        }
        if (final[r][c].includes("RM*R*")) {
          tra = final[r][c].replace("RM*R*", "");
          tra1D = d;
        }
        if (final[r][c].includes("KN-I")) {
          tk = final[r][c].replace("KN-IEUR", "").trim();
          tk2 = final[r][c + 1].replace("EUR", "").trim();
        }
        if (final[r][c].includes("N-")) {
          if (final[r][c].includes("EUR")) {
            tn = final[r][c].replace("N-EUR", "").trim();
          }
          if (final[r][c].includes("NUC")) {
            tn = final[r][c].replace("N-NUC", "").trim();
          }
        }
        if (final[r][c].includes("T-L")) {
          tc = final[r][c].replace("T-L", "").trim();
        }
        if (final[r][c].includes("FPD")) {
          cn = final[r][c].replace("MFPDCCA", "").trim();
          cn = cn.split("/")[0];
        }
        if (final[r][c].includes("CTCM")) {
          let tph = final[r][c].split("/");
          p = tph.hasOwnProperty(1) && tph[1];
        }
        if (final[r][c].includes("H-")) {
          ard.push(final[r]);
        }
      }
    }

    let dstr = "";
    let t1s = "";
    let t2s = "";
    for (let i = 0; i < ard.length; i++) {
      let dd = ard[i][5];
      let dd2 = dd.split(" ");
      let d2l = dd2.length;
      dstr += dd2[d2l - 1] + " - ";
      t1s += ard[i][2] + " - ";
      t2s += ard[i][4] + " - ";
    }

    dstr = dstr.replace(/-\s*$/, "").trim();
    t1s = t1s.replace(/-\s*$/, "").trim();
    t2s = t2s.replace(/-\s*$/, "").trim();
    tk = tk.trim() ? parseFloat(tk) : 0;
    tk2 = tk2.trim() ? parseFloat(tk2) : 0;
    tra = tra.trim() ? parseFloat(tra) : 0;
    tn = tn.trim() ? parseFloat(tn) : 0;
    pr = parseFloat((tra - tk2).toFixed(2));
    let ntl = n.length;
    n.map((ntp, i) => {
      let tkt = {
        name: ntp,
        bookingCode: c2,
        agent: agl.hasOwnProperty(ag) ? agl[ag] : ag,
        iata: iac.hasOwnProperty(ia) ? iac[ia] : ia,
        agentCost: ac,
        ticketNumber: t[i],
        paymentMethod: mt,
        paidAmount: tk2,
        receivingAmount1: tra,
        receivingAmount1Date: tra1D,
        receivingAmount2Date: tra2D,
        receivingAmount2Method: "",
        receivingAmount3Date: tra3D,
        receivingAmount3Method: "",
        receivingAmount2: 0,
        receivingAmount3: 0,
        cardNumber: cn,
        bookedOn: d,
        travel1: t1s,
        travel2: t2s,
        dates: dstr,
        phone: p,
        flight: f,
        refund: "",
        refundDate: "",
        supplied: 0,
        returned: 0,
        returnedDate: "",
      };
      fc.push(tkt);
    });
  });

  fc.map((f) => {
    //console.log(f);
    create(f);
  });
}
