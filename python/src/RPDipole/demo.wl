(* spell-checker:words Lpwl, opac, xyval, yzval, zxval *)

(* Lpwl_: Length / Wavelength *)

RadiationPattern[Lpwl_, {theta_, phi_}, mesh_, opac_, step_, pg_] :=
  Quiet[
    Module[{l, lr, fun, max, xyval, yzval1, yzval2, zxval1, zxval2, xy,
       yz, zx, box, ci, sf, cf},
      fun =
        Table[
          If[Abs[(Cos[(Pi Lpwl) Cos[\[Xi]]] - Cos[Pi Lpwl])] / Sin[\[Xi]
            ] === Indeterminate,
            Abs[Pi Lpwl Sin[Pi Lpwl Cos[\[Xi]]] Sin[\[Xi]] / Cos[\[Xi]
              ]]
            ,
            Abs[(Cos[(Pi Lpwl) Cos[\[Xi]]] - Cos[Pi Lpwl])] / Sin[\[Xi]
              ]
          ]
          ,
          {\[Xi], 0, Pi, Pi / 180}
        ];
      max = Max[fun];
      l[th_, ph_] = {Sin[th Degree] Cos[ph Degree], Sin[th Degree] Sin[
        ph Degree], Cos[th Degree]};
      lr[th_, ph_, t_, f_] = Sin[th Degree] Cos[ph Degree] Sin[t] Cos[
        f] + Sin[th Degree] Sin[ph Degree] Sin[t] Sin[f] + Cos[th Degree] Cos[
        t];
      EE[Len_, th_, ph_, t_, f_] = Abs[(Cos[Pi Len lr[th, ph, t, f]] 
        - Cos[Pi Len])] / Sqrt[1 - lr[th, ph, t, f] ^ 2];
      sf = Table[N[Sin[i]], {i, 0, 2 Pi, Pi / 180}];
      cf = Table[N[Cos[i]], {i, 0, 2 Pi, Pi / 180}];
      xyval =
        Table[
          If[EE[Lpwl, theta, phi, Pi / 2, f] === Indeterminate,
            0.
            ,
            EE[Lpwl, theta, phi, Pi / 2, f]
          ]
          ,
          {f, 0, 2 Pi, Pi / 180}
        ];
      yzval1 =
        Table[
          If[EE[Lpwl, theta, phi, t, Pi / 2] === Indeterminate,
            0.
            ,
            EE[Lpwl, theta, phi, t, Pi / 2]
          ]
          ,
          {t, 0, Pi, Pi / 180}
        ];
      yzval2 =
        Table[
          If[EE[Lpwl, theta, phi, t, 3 Pi / 2] === Indeterminate,
            0.
            ,
            EE[Lpwl, theta, phi, t, 3 Pi / 2]
          ]
          ,
          {t, 0, Pi, Pi / 180}
        ];
      zxval1 =
        Table[
          If[EE[Lpwl, theta, phi, t, 0] === Indeterminate,
            0.
            ,
            EE[Lpwl, theta, phi, t, 0]
          ]
          ,
          {t, 0, Pi, Pi / 180}
        ];
      zxval2 =
        Table[
          If[EE[Lpwl, theta, phi, t, Pi] === Indeterminate,
            0.
            ,
            EE[Lpwl, theta, phi, t, Pi]
          ]
          ,
          {t, 0, Pi, Pi / 180}
        ];
      xy = {RGBColor[0, 0, 1], Line[Table[{cf[[i]] xyval[[i]] / max, 
        sf[[i]] xyval[[i]] / max, 0}, {i, 1, 361}]]};
      yz = {RGBColor[1, 0, 0], Line[Table[{0, sf[[i]] yzval1[[i]] / max,
         cf[[i]] yzval1[[i]] / max}, {i, 1, 181}]], Line[Table[{0, -sf[[i]] yzval2
        [[i]] / max, cf[[i]] yzval2[[i]] / max}, {i, 1, 181}]]};
      zx = {RGBColor[0, 1, 0], Line[Table[{sf[[i]] zxval1[[i]] / max,
         0, cf[[i]] zxval1[[i]] / max}, {i, 1, 181}]], Line[Table[{-sf[[i]] zxval2
        [[i]] / max, 0, cf[[i]] zxval2[[i]] / max}, {i, 1, 181}]]};
      box = {{-2, -2, -2}, {-2, 2, -2}, {2, 2, -2}, {2, -2, -2}, {-2,
         -2, 2}, {-2, 2, 2}, {2, 2, 2}, {2, -2, 2}};
      ci = {Line[Table[{Cos[i], Sin[i], 0}, {i, 0, 2 Pi, Pi / 36}]]};
        
      Show[
        Graphics3D[{{GrayLevel[0.5], Translate[ci, {0, 0, -2}], Translate[
          Rotate[ci, Pi / 2, {1, 0, 0}], {0, -2, 0}], Translate[Rotate[ci, Pi /
           2, {0, 1, 0}], {-2, 0, 0}]}, {Thin, GrayLevel[0.5], GraphicsComplex[
          box, Line[{{1, 2, 3, 4}, {1, 4, 8, 5}, {1, 5, 6, 2}}]]}, {RGBColor[1,
           0, 0], Line[{{-1, 0, -2}, {1., 0, -2}}], Line[{{-1, -2, 0}, {1., -2,
           0}}]}, {RGBColor[0, 1, 0], Line[{{0, -1., -2}, {0, 1., -2}}], Line[{
          {-2, -1., 0}, {-2, 1., 0}}]}, {RGBColor[0, 0, 1], Line[{{0, -2, -1.},
           {0, -2, 1.}}], Line[{{-2, 0, -1.}, {-2, 0, 1.}}]}}]
        ,
        SphericalPlot3D[Evaluate[EE[Lpwl, theta, phi, t, f] / max], {
          t, 0, Pi}, {f, 0, 2 Pi}, PlotPoints -> {(180 / step) + 1, (360 / step
          ) + 1}, Mesh -> mesh, MeshStyle -> GrayLevel[0.75], PlotStyle -> Directive[
          Opacity[opac], GrayLevel[0.25], Specularity[White, 10]], PerformanceGoal
           -> pg]
        ,
        Graphics3D[
          {
            {Directive[Red, Specularity[White, 10]], Arrowheads[.05],
               Arrow[Tube[{{0, 0, 0}, {1.8, 0, 0}}, 0.015]]}
            ,
            {Directive[Green, Specularity[White, 10]], Arrowheads[.05
              ], Arrow[Tube[{{0, 0, 0}, {0, 1.8, 0}}, 0.015]]}
            ,
            {Directive[Blue, Specularity[White, 10]], Arrowheads[.05],
               Arrow[Tube[{{0, 0, 0}, {0, 0, 1.8}}, 0.015]]}
            ,
            {Directive[Orange, Specularity[White, 10]], Arrowheads[.05
              ], Arrow[Tube[{-1.5 l[theta, phi], 1.5 l[theta, phi]}, 0.015]]}
            ,
            {Directive[Yellow, Specularity[White, 10]], EdgeForm[], Sphere[
              {0, 0, 0}, 0.05]}
            ,
            {
              {
                If[mesh =!= None,
                  Thick
                  ,
                  Thin
                ]
                ,
                xy
                ,
                yz
                ,
                zx
              }
              ,
              Translate[xy, {0, 0, -2}]
              ,
              Translate[yz, {-2, 0, 0}]
              ,
              Translate[zx, {0, -2, 0}]
            }
          }
        ]
      ]
    ]
  ]
