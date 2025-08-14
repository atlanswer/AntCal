---
layout: layouts/Markdown.astro
---

# AntCal Documentation

## Radiation Pattern Analysis

Analyze radiation pattern based on electric or magnetic sources.

**Limitations**

- Amplitudes are not normalized and have no relation with the actual gain. Should be fixed soon<sup>TM</sup>
- If the normalization is performed per plane. Glitches could emerge if the values are too small
- Computation is not optimized. If the resolution is high, the update could be slow

**TODOs**

- [x] &nbsp;Legend
- [x] &nbsp;Per plane or global normalization
- [x] &nbsp;Split theta and phi components or view total
- [ ] &nbsp;Ticks on the figure
- [ ] &nbsp;Stats for the pattern, e.g., max gain direction, HPBW
- [ ] &nbsp;UI update
- [ ] &nbsp;Rectangular figure
- [ ] &nbsp;UI for creating arrays
- [ ] &nbsp;Source placement visualization
- [ ] &nbsp;3D spherical pattern

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

### Sources

The rotation of each source is defined by

$$
\begin{equation}
\mathbf{v}' = R_z(\phi_0)R_y(\theta_0)\mathbf{v}
\text{,}
\end{equation}
$$

where [^rotation]

$$
\begin{align}
R_x(\theta) &=
\begin{bmatrix}
1 & 0 & 0 \\
0 & \cos\theta & -\sin\theta \\
0 & \sin\theta & \cos\theta
\end{bmatrix} \\
R_y(\theta) &=
\begin{bmatrix}
\cos\theta & 0 & \sin\theta \\
0 & 1 & 0 \\
-\sin\theta & 0 & \cos\theta
\end{bmatrix} \\
R_z(\phi) &=
\begin{bmatrix}
\cos\phi & -\sin\phi & 0 \\
\sin\phi & \cos\phi & 0 \\
0 & 0 & 1
\end{bmatrix}
\text{.}
\end{align}
$$

The inverse rotation is given by

$$
\begin{equation}
\mathbf{v} = R_y(-\theta_0)R_z(-\phi_0)\mathbf{v}'
\text{.}
\end{equation}
$$

For $\mathbf{v}'
= [\theta', \phi']^T
= [\sin\theta'\cos\phi', \sin\theta'\sin\phi', \cos\theta']^T$,

$$
\begin{align}
x &= \cos\theta_0\sin\theta'\cos(\phi' - \phi_0) - \sin\theta_0\cos\theta' \\
y &= \sin\theta'\sin(\phi' - \phi_0) \\
z &= \sin\theta_0\sin\theta'\cos(\phi - \phi_0) + \cos\theta_0\cos\theta'\\

\theta &= \arccos(z) \\
\phi &= \operatorname{atan2}(y, x) \\

\mathbf{v} &=
\begin{bmatrix}
\theta \\ \phi
\end{bmatrix}
\end{align}
$$

[^rotation]: [Rotation Matrix](https://en.wikipedia.org/wiki/Rotation_matrix#In_three_dimensions)

#### E-Dipole: Finite Length Dipole

The length is represented by $L = l/\lambda$.

$$
\begin{equation}
U(\theta) = \frac{\eta|I_0|^2}{8\pi^2}\left[
\frac{\cos(\pi L\cos\theta) - \cos(\pi L)}{\sin\theta}
\right]^2
\end{equation}
$$

If $L$ = 0.5, $G_{\text{max}}$ ≈ 1.64 (2.15 dBi), HPBW ≈ 78°.

#### M-Dipole: Circular Loop of Constant Current

Assumed to be a small loop.

$$
\begin{equation}
U(\theta) = \frac{\eta k^4m^2\sin^2\theta}{32\pi^2}
\end{equation}
$$

$G_{\text{max}}$ = 1.5 (1.76 dBi), HPBW = 120°.

### Phasor Addition [^phase-shift] [^phasor-addition]

We have

$$
\begin{equation}
a\sin(x+\theta_a)+b\sin(x+\theta_b)=c\sin(x+\varphi)\text{,}
\end{equation}
$$

where $c$ and $\varphi$ satisfy

$$
\begin{gather}
c^2=a^2+b^2+2ab\cos(\theta_a-\theta_b)\text{,} \\
\tan\varphi=\frac{a\sin\theta_a+b\sin\theta_b}{a\cos\theta_a+b\cos\theta_b}\text{.}
\end{gather}
$$

$\varphi$ can be calculated like this

$$
\begin{equation}
\varphi=\operatorname{atan2}(a\sin\theta_a+b\sin\theta_b,\ a\cos\theta_a+b\cos\theta_b)\text{.}
\end{equation}
$$

[^phase-shift]: [Trigonometric Identities](https://en.wikipedia.org/wiki/List_of_trigonometric_identities#Arbitrary_phase_shift)

[^phasor-addition]: [Phasor Addition](https://en.wikipedia.org/wiki/Phasor#Addition)

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
- [x] &nbsp; Normal and dark color variant
- [x] &nbsp; Map vector size
- [ ] &nbsp; Vector arrow shape selection
- [ ] &nbsp; Represent scalar fields with contour plots

**Notes:**

- Figure width is fixed to 3.5 inches with a DPI of 72 according to the IEEE guidance
- Vector positions are normalized to be evenly distributed around the origin
- Vector arrows are facing the user by default
- The color map is the dark variant of the Mathematica rainbow

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

$$
$$
