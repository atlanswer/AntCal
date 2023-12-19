# Autoencoders

Structure: $\mathbf{\mathit{x}}\xmapsto{f}\mathbf{\mathit{h}}\xmapsto{g}\mathbf{\mathit{r}}$

- Encoder: $\mathbf{\mathit{h}}=f(x)$
- Decoder: $r=g(h)$

Types:

- Undercomplete: code dimension is less than the input
- Overcomplete: code has dimension greater than the input

Learning: minimize the loss function

$$\begin{equation}
L(x,g(f(x)))
\end{equation}$$

## Regularized Autoencoders

### Sparse Autoencoders

The training criterion involves a sparsity penalty $\Omega(h)$:

$$\begin{equation}
L(x,g(f(x))) + \Omega(h)
\end{equation}$$

Approximating maximum likelihood training of a generative
model that has latent variables.

- Visible variables $x$
- Latent variables $h$

Joint distribution:

$$\begin{equation}
p_\text{model}(x,h)=p_\text{model}(h)p_\text{model}(x|h)
\end{equation}$$

### Denoising Autoencoders

DAE minimizes

$$\begin{equation}
L(x,g(f(\tilde{x})))
\end{equation}$$

where $\tilde{x}$ is $x + \text{noise}$.

### Contractive Autoencoders

Use a different penalty $\Omega$:

$$\begin{equation}
L(x,g(f(x))) + \Omega(h,x)
\end{equation}$$

and

$$\begin{equation}
\Omega(h,x) = \lambda\sum_i ||\nabla_x h_i||^2
\end{equation}$$

## Deep Autoencoders

## Stochastic Encoders and Decoders
