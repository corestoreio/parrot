"""add users table

Revision ID: d9bebbe4439b
Revises: 2a8981379eba
Create Date: 2018-01-10 16:21:42.860068

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'd9bebbe4439b'
down_revision = '2a8981379eba'
branch_labels = None
depends_on = None


def upgrade():
    op.execute("""
        CREATE TABLE users (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            password TEXT NOT NULL,
            UNIQUE (email)
        );
    """)


def downgrade():
    op.execute("""
        DROP TABLE users;
    """)
