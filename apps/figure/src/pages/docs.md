---
layout: layouts/Markdown.astro
---

# AntCal Documentation

## Field

Visualize vector fields in an interactive SVG.

**TODOs:**

- [x] &nbsp; Fix arrow stroke and tail when it's too small
- [x] &nbsp; Quick link to different views
- [x] &nbsp; Vector arrow
- [x] &nbsp; Vector length control
- [x] &nbsp; Figure height control
- [x] &nbsp; Vector arrow tail length control
- [x] &nbsp; Colorbar
- [ ] &nbsp; Normal and dark color variant
- [ ] &nbsp; Vector arrow shape selection

**Notes:**

- Figure width is fixed to 3.5 inches with a DPI of 72 according to the IEEE guidence
- Vector positions are normalized to be evenly distributed around the origin
- Vector arrows are facing the user by default

**Limitations:**

- Only supports field data files (`.fld`) exported from ANSYS HFSS
- Currently, only grid-based vector field is supported (vector shape: `[x, y, z, u, v, w]`)
- Pan motion is not implemented. The figure only rotates around its center

### How to export vector fields in ANSYS HFSS

1. Measure the bounding box (in Cartesian coordinate system) of the area of interest
2. Open the Field Calculator (e.g., right click Field Overlays)
3. Select the desired quantity (e.g., `Vector_E`) and copy it to the stack (or construct your own vector quantity)
4. Select the correct context (especially the phase)
5. Click "Export..."
6. Use "Calculate grid points", fill in the grid dimensions based on the bounding box
7. Check "Include points in output file" to include vector starting positions in the file
8. Save the `.fld` file

## Report (TODO)

Upload data files to generate figures.

## Radiation Pattern (WIP)

Simulate radiation pattern based on electric or magnetic sources.

**Limitations:**

- Currently all sources are positioned at the origin
- Amplitudes are normalized to the maximum radiation of E-/M-dipole respectively
- Far fields are sampled with limited resolution of 1°

### Vector Potentials

$$
\begin{align}
\mathbf{A} &= \frac{\mu}{4\pi} \int_{C} \mathbf{I}_e(x',y',z')\frac{e^{-jkR}}{R} dl' \\
\mathbf{F} &= \frac{\epsilon}{4\pi} \int_{C} \mathbf{I}_m(x',y',z')\frac{e^{-jkR}}{R} dl'
\end{align}
$$

### Far-Field Region

$$
\begin{align}
\mathbf{E}_A &\simeq -j\omega\mathbf{A} \\
\mathbf{H}_A &\simeq \frac{\hat{\mathbf{a}}_r}{\eta}\times\mathbf{E}_A
= -j\frac{\omega}{\eta}\hat{\mathbf{a}}_r\times\mathbf{A} \\
\mathbf{E}_F &\simeq -j\omega\mathbf{F} \\
\mathbf{H}_F &\simeq -\eta\hat{\mathbf{a}}_r\times\mathbf{H}_F
= j\omega\eta\hat{\mathbf{a}}_r\times\mathbf{F} \\
\end{align}
$$

### Finite Length Dipole

### E-dipole:

- Gain $θ$: $\sin(\theta)\cos(\phi)$
- Gain $ϕ$: $\sin(\phi)$

### M-dipole:

- Gain $θ$: $\sin(\phi)$
- Gain $ϕ$: $\sin(\theta)\cos(\phi)$

### Linear Combination with Arbitrary Phase Shift [^wikipedia]

We have

$$
a\sin(x+\theta_a)+b\sin(x+\theta_b)=c\sin(x+\varphi)
$$

where $c$ and $\varphi$ satisfy

$$
\begin{gather*}
c=\sqrt{a^2+b^2+2ab\cos(\theta_a-\theta_b)}\text{,} \\
\varphi=\operatorname{atan2}(a\cos\theta_a+b\cos\theta_b,\ a\sin\theta_a+b\sin\theta_b)\text{.}
\end{gather*}
$$

Note: $\operatorname{atan2(y,\ x)}$ uses Numpy's [`arctan2`](https://numpy.org/doc/stable/reference/generated/numpy.arctan2.html) parameter order.

[^wikipedia]: [Trigonometric Identities](https://en.wikipedia.org/wiki/List_of_trigonometric_identities#Arbitrary_phase_shift)

## Reference

See [IEEE Author Center](https://journals.ieeeauthorcenter.ieee.org).

> 10pt is used by the vast majority of papers.
>
> —How to Use the IEEEtran LaTeX Class

> Format and save your graphics using a suitable
> graphics processing program that will allow
> you to create the images as PostScript (PS),
> Encapsulated PostScript (.EPS),
> Tagged Image File Format (.TIFF),
> Portable Document Format (.PDF),
> or Portable Network Graphics (.PNG).
>
> Most charts, graphs, and tables are one column wide
> (3.5 inches / 88 millimeters / 21 picas)
> or page wide (7.16 inches / 181 millimeters / 43 picas).
> The maximum depth a graphic can be is 8.5 inches
> (216 millimeters / 54 picas).
>
> Author photographs, color, and grayscale figures
> should be at 300 dpi.
> Lineart, including tables should be a minimum
> of 600 dpi.
>
> While IEEE does accept vector artwork,
> it is our policy is to rasterize
> all figures for publication.
> This is done in order to preserve the
> figures’ integrity across multiple computer platforms.
>
> All color figures should be generated in RGB
> or CMYK color space.
> Grayscale images should be submitted in
> Grayscale color space.
> Line art may be provided in grayscale
> OR bitmap colorspace.
>
> When preparing your graphics IEEE suggests
> that you use of one of the
> following Open Type fonts:
> Times New Roman, Helvetica, Arial, Cambria, and Symbol.
>
> —Preparation of Papers for IEEE Transactions and Journals (April 2013)
